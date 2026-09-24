const crypto = require('crypto');
const db = require('../config/db');

// Valid coupon definitions with server-enforced business rules
const COUPONS = {
  AAIJI10: {
    code: 'AAIJI10',
    type: 'percentage',
    value: 10,
    minOrder: 500,
    maxDiscount: 200,
    description: '10% OFF on orders above ₹500 (Max ₹200)',
  },
  PUREHONEY: {
    code: 'PUREHONEY',
    type: 'flat',
    value: 100,
    minOrder: 999,
    maxDiscount: 100,
    description: 'Flat ₹100 OFF on orders above ₹999',
  },
  FARMDIRECT: {
    code: 'FARMDIRECT',
    type: 'percentage',
    value: 15,
    minOrder: 1500,
    maxDiscount: 300,
    description: '15% OFF on bulk orders above ₹1500 (Max ₹300)',
  },
};

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 50;
const GST_PERCENTAGE = 5; // 5% GST on natural honey

/**
 * Retrieve or create persistent cart row for an authenticated user
 */
const getOrCreateUserCart = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required to get or create cart');
  }

  const findResult = await db.query(
    'SELECT * FROM carts WHERE user_id = $1 LIMIT 1',
    [userId]
  );

  if (findResult.rows.length > 0) {
    const row = findResult.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
      savedForLater: typeof row.saved_for_later === 'string' ? JSON.parse(row.saved_for_later) : (row.saved_for_later || []),
    };
  }

  const cartId = crypto.randomBytes(12).toString('hex');
  const insertResult = await db.query(
    `INSERT INTO carts (id, user_id, items, saved_for_later)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [cartId, userId, JSON.stringify([]), JSON.stringify([])]
  );

  const newRow = insertResult.rows[0];
  return {
    id: newRow.id,
    userId: newRow.user_id,
    items: [],
    savedForLater: [],
  };
};

/**
 * Hydrate cart items and saved-for-later with live PostgreSQL product data.
 * Always recalculates prices, stock limits, discounts, and totals from the DB source of truth.
 */
const hydrateCart = async (items = [], savedForLater = [], couponCode = null) => {
  // Extract all unique product IDs across items and savedForLater
  const allProductIds = Array.from(
    new Set([
      ...items.map((i) => i.productId || i.id).filter(Boolean),
      ...savedForLater.map((i) => i.productId || i.id).filter(Boolean),
    ])
  );

  const productMap = new Map();
  if (allProductIds.length > 0) {
    const query = `
      SELECT 
        id, 
        name, 
        price, 
        image, 
        offer, 
        flavour, 
        COALESCE(stock, 50)::int AS stock, 
        COALESCE(is_active, true)::boolean AS "isActive",
        original_price AS "originalPrice"
      FROM products 
      WHERE id = ANY($1::varchar[])
    `;
    const res = await db.query(query, [allProductIds]);
    res.rows.forEach((p) => {
      productMap.set(p.id, {
        ...p,
        price: parseFloat(p.price) || 0,
        originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : Math.round((parseFloat(p.price) || 0) * 1.25),
        stock: parseInt(p.stock, 10) ?? 50,
        isActive: p.isActive !== false,
      });
    });
  }

  const changes = [];
  const hydratedItems = [];
  let subtotal = 0;
  let totalProductDiscount = 0;
  let totalItemCount = 0;

  for (const item of items) {
    const pId = item.productId || item.id;
    const product = productMap.get(pId);

    if (!product || !product.isActive) {
      changes.push({
        productId: pId,
        reason: 'PRODUCT_UNAVAILABLE',
        message: product ? `${product.name} is currently unavailable.` : 'A product in your cart has been removed.',
      });
      hydratedItems.push({
        productId: pId,
        name: product?.name || 'Unavailable Honey Product',
        image: product?.image || '/placeholder.jpg',
        flavour: product?.flavour || '',
        price: product?.price || 0,
        originalPrice: product?.originalPrice || 0,
        quantity: item.quantity,
        stock: 0,
        isAvailable: false,
        itemSubtotal: 0,
        addedAt: item.addedAt,
      });
      continue;
    }

    const availableStock = Math.max(0, product.stock);
    let effectiveQuantity = parseInt(item.quantity, 10) || 1;
    let stockClamped = false;

    if (availableStock === 0) {
      changes.push({
        productId: pId,
        productName: product.name,
        reason: 'OUT_OF_STOCK',
        message: `${product.name} is currently out of stock.`,
      });
      effectiveQuantity = 0;
      stockClamped = true;
    } else if (effectiveQuantity > availableStock) {
      changes.push({
        productId: pId,
        productName: product.name,
        reason: 'STOCK_LIMITED',
        requestedQuantity: effectiveQuantity,
        availableQuantity: availableStock,
        message: `Only ${availableStock} units of ${product.name} are available. Quantity adjusted.`,
      });
      effectiveQuantity = availableStock;
      stockClamped = true;
    }

    const itemSubtotal = product.price * effectiveQuantity;
    const itemOriginalTotal = product.originalPrice * effectiveQuantity;
    const itemDiscount = Math.max(0, itemOriginalTotal - itemSubtotal);

    if (effectiveQuantity > 0) {
      subtotal += itemSubtotal;
      totalProductDiscount += itemDiscount;
      totalItemCount += effectiveQuantity;
    }

    hydratedItems.push({
      productId: product.id,
      name: product.name,
      image: product.image,
      flavour: product.flavour || 'Raw Desert Blossom',
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercentage: product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0,
      quantity: effectiveQuantity,
      stock: availableStock,
      isAvailable: availableStock > 0,
      stockClamped,
      itemSubtotal,
      addedAt: item.addedAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    });
  }

  // Hydrate Saved for Later items
  const hydratedSaved = savedForLater
    .map((saved) => {
      const pId = saved.productId || saved.id;
      const product = productMap.get(pId);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        image: product.image,
        flavour: product.flavour || 'Raw Desert Blossom',
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
        isAvailable: product.isActive && product.stock > 0,
        addedAt: saved.addedAt || new Date().toISOString(),
      };
    })
    .filter(Boolean);

  // Apply Coupon Calculation dynamically from Database
  let couponDiscount = 0;
  let appliedCoupon = null;
  let couponError = null;

  if (couponCode) {
    const normalizedCode = String(couponCode).trim().toUpperCase();
    try {
      const couponRes = await db.query(
        'SELECT * FROM coupons WHERE UPPER(code) = $1 AND is_active = TRUE LIMIT 1',
        [normalizedCode]
      );

      if (couponRes.rows.length === 0) {
        couponError = 'Invalid or expired promo code.';
      } else {
        const couponDef = couponRes.rows[0];
        const minOrder = parseFloat(couponDef.min_order_amount) || 0;
        const discountPct = parseInt(couponDef.discount_percentage, 10);
        const maxDisc = couponDef.max_discount ? parseFloat(couponDef.max_discount) : null;

        if (subtotal < minOrder) {
          couponError = `Promo code requires a minimum order value of ₹${minOrder}.`;
        } else {
          const calculated = Math.round((subtotal * discountPct) / 100);
          couponDiscount = maxDisc ? Math.min(calculated, maxDisc) : calculated;
          appliedCoupon = {
            id: couponDef.id,
            code: couponDef.code,
            discountPercentage: discountPct,
            description: couponDef.description || `${discountPct}% OFF`,
            discount: couponDiscount,
          };
        }
      }
    } catch (cErr) {
      console.error('Error validating coupon against DB:', cErr.message);
      couponError = 'Failed to validate promo code.';
    }
  }

  // Shipping calculation
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const freeShippingRemaining = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Tax calculation (5% GST)
  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const tax = Math.round(taxableAmount * (GST_PERCENTAGE / 100));

  // Final Total
  const total = Math.max(0, Math.round(taxableAmount + shipping + tax));

  return {
    items: hydratedItems,
    savedForLater: hydratedSaved,
    itemCount: totalItemCount,
    subtotal: Math.round(subtotal),
    productDiscount: Math.round(totalProductDiscount),
    couponDiscount,
    appliedCoupon,
    couponError,
    shipping,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    freeShippingRemaining,
    tax,
    gstPercentage: GST_PERCENTAGE,
    total,
    changes,
    isValidForCheckout: hydratedItems.length > 0 && hydratedItems.every((i) => i.isAvailable && i.quantity > 0),
  };
};

/**
 * Save user cart items and saved_for_later to NeonDB
 */
const saveUserCart = async (userId, items, savedForLater) => {
  const cleanItems = items.map((i) => ({
    productId: i.productId || i.id,
    quantity: Math.max(1, parseInt(i.quantity, 10) || 1),
    addedAt: i.addedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const cleanSaved = savedForLater.map((s) => ({
    productId: s.productId || s.id,
    addedAt: s.addedAt || new Date().toISOString(),
  }));

  await db.query(
    `UPDATE carts 
     SET items = $1, saved_for_later = $2, updated_at = CURRENT_TIMESTAMP 
     WHERE user_id = $3`,
    [JSON.stringify(cleanItems), JSON.stringify(cleanSaved), userId]
  );
};

/**
 * Add an item to user's cart
 */
const addItem = async (userId, productId, requestedQuantity = 1, couponCode = null) => {
  if (!productId) {
    throw new Error('Product ID is required');
  }

  const cleanQty = Math.max(1, parseInt(requestedQuantity, 10) || 1);

  // Validate product in DB
  const prodRes = await db.query(
    'SELECT id, name, price, stock, is_active FROM products WHERE id = $1',
    [productId]
  );

  if (prodRes.rows.length === 0) {
    const err = new Error('Product not found');
    err.code = 'PRODUCT_NOT_FOUND';
    err.status = 404;
    throw err;
  }

  const product = prodRes.rows[0];
  if (product.is_active === false) {
    const err = new Error(`${product.name} is currently unavailable.`);
    err.code = 'PRODUCT_UNAVAILABLE';
    err.status = 400;
    throw err;
  }

  const availableStock = parseInt(product.stock, 10) ?? 50;
  if (availableStock <= 0) {
    const err = new Error(`${product.name} is currently out of stock.`);
    err.code = 'OUT_OF_STOCK';
    err.status = 400;
    throw err;
  }

  const cart = await getOrCreateUserCart(userId);
  const items = [...cart.items];
  const existingIndex = items.findIndex((i) => (i.productId || i.id) === productId);

  if (existingIndex > -1) {
    const currentInCart = parseInt(items[existingIndex].quantity, 10) || 0;
    const newQty = currentInCart + cleanQty;

    if (newQty > availableStock) {
      const maxAddable = Math.max(0, availableStock - currentInCart);
      const err = new Error(
        maxAddable > 0
          ? `You already have ${currentInCart} in your cart. You can only add ${maxAddable} more (Stock limit: ${availableStock}).`
          : `You already have the maximum available stock (${availableStock}) in your cart.`
      );
      err.code = 'INSUFFICIENT_STOCK';
      err.status = 400;
      err.details = { available: availableStock, inCart: currentInCart, maxAddable };
      throw err;
    }

    items[existingIndex].quantity = newQty;
    items[existingIndex].updatedAt = new Date().toISOString();
  } else {
    if (cleanQty > availableStock) {
      const err = new Error(`Only ${availableStock} units available for ${product.name}.`);
      err.code = 'INSUFFICIENT_STOCK';
      err.status = 400;
      err.details = { available: availableStock, requested: cleanQty };
      throw err;
    }

    items.push({
      productId: product.id,
      quantity: cleanQty,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Remove from savedForLater if it was there
  const savedForLater = cart.savedForLater.filter((s) => (s.productId || s.id) !== productId);

  await saveUserCart(userId, items, savedForLater);
  return hydrateCart(items, savedForLater, couponCode);
};

/**
 * Update quantity of an item in user's cart
 */
const updateQuantity = async (userId, productId, newQuantity, couponCode = null) => {
  const qty = parseInt(newQuantity, 10);
  const cart = await getOrCreateUserCart(userId);
  let items = [...cart.items];

  if (isNaN(qty) || qty <= 0) {
    // Remove if 0 or negative
    items = items.filter((i) => (i.productId || i.id) !== productId);
    await saveUserCart(userId, items, cart.savedForLater);
    return hydrateCart(items, cart.savedForLater, couponCode);
  }

  // Validate stock
  const prodRes = await db.query(
    'SELECT id, name, stock, is_active FROM products WHERE id = $1',
    [productId]
  );

  if (prodRes.rows.length === 0) {
    items = items.filter((i) => (i.productId || i.id) !== productId);
    await saveUserCart(userId, items, cart.savedForLater);
    const err = new Error('Product no longer exists. Removed from cart.');
    err.code = 'PRODUCT_NOT_FOUND';
    err.status = 404;
    throw err;
  }

  const product = prodRes.rows[0];
  const availableStock = parseInt(product.stock, 10) ?? 50;

  if (qty > availableStock) {
    const err = new Error(`Only ${availableStock} units available in stock.`);
    err.code = 'INSUFFICIENT_STOCK';
    err.status = 400;
    err.details = { available: availableStock, requested: qty };
    throw err;
  }

  const targetIndex = items.findIndex((i) => (i.productId || i.id) === productId);
  if (targetIndex > -1) {
    items[targetIndex].quantity = qty;
    items[targetIndex].updatedAt = new Date().toISOString();
  } else {
    items.push({
      productId,
      quantity: qty,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  await saveUserCart(userId, items, cart.savedForLater);
  return hydrateCart(items, cart.savedForLater, couponCode);
};

/**
 * Remove an item from user's cart
 */
const removeItem = async (userId, productId, couponCode = null) => {
  const cart = await getOrCreateUserCart(userId);
  const items = cart.items.filter((i) => (i.productId || i.id) !== productId);
  await saveUserCart(userId, items, cart.savedForLater);
  return hydrateCart(items, cart.savedForLater, couponCode);
};

/**
 * Clear all items from user's cart
 */
const clearCart = async (userId) => {
  const cart = await getOrCreateUserCart(userId);
  await saveUserCart(userId, [], cart.savedForLater);
  return hydrateCart([], cart.savedForLater, null);
};

/**
 * Move item between Cart and Saved for Later
 */
const saveForLater = async (userId, productId, couponCode = null) => {
  const cart = await getOrCreateUserCart(userId);
  const itemToSave = cart.items.find((i) => (i.productId || i.id) === productId);

  if (!itemToSave) {
    return hydrateCart(cart.items, cart.savedForLater, couponCode);
  }

  const items = cart.items.filter((i) => (i.productId || i.id) !== productId);
  const savedForLater = [...cart.savedForLater];

  if (!savedForLater.some((s) => (s.productId || s.id) === productId)) {
    savedForLater.push({
      productId,
      addedAt: new Date().toISOString(),
    });
  }

  await saveUserCart(userId, items, savedForLater);
  return hydrateCart(items, savedForLater, couponCode);
};

/**
 * Move item from Saved for Later back to Cart
 */
const moveToCart = async (userId, productId, couponCode = null) => {
  const cart = await getOrCreateUserCart(userId);
  const savedItem = cart.savedForLater.find((s) => (s.productId || s.id) === productId);

  if (!savedItem) {
    return hydrateCart(cart.items, cart.savedForLater, couponCode);
  }

  // Check stock
  const prodRes = await db.query(
    'SELECT id, name, stock, is_active FROM products WHERE id = $1',
    [productId]
  );

  if (prodRes.rows.length === 0 || prodRes.rows[0].is_active === false) {
    const err = new Error('Product is currently unavailable.');
    err.code = 'PRODUCT_UNAVAILABLE';
    err.status = 400;
    throw err;
  }

  const availableStock = parseInt(prodRes.rows[0].stock, 10) ?? 50;
  if (availableStock <= 0) {
    const err = new Error('Product is currently out of stock.');
    err.code = 'OUT_OF_STOCK';
    err.status = 400;
    throw err;
  }

  const savedForLater = cart.savedForLater.filter((s) => (s.productId || s.id) !== productId);
  const items = [...cart.items];
  const existingInCart = items.find((i) => (i.productId || i.id) === productId);

  if (existingInCart) {
    existingInCart.quantity = Math.min(availableStock, (existingInCart.quantity || 1) + 1);
    existingInCart.updatedAt = new Date().toISOString();
  } else {
    items.push({
      productId,
      quantity: 1,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  await saveUserCart(userId, items, savedForLater);
  return hydrateCart(items, savedForLater, couponCode);
};

/**
 * Remove an item from Saved for Later
 */
const removeSavedItem = async (userId, productId, couponCode = null) => {
  const cart = await getOrCreateUserCart(userId);
  const savedForLater = cart.savedForLater.filter((s) => (s.productId || s.id) !== productId);
  await saveUserCart(userId, cart.items, savedForLater);
  return hydrateCart(cart.items, savedForLater, couponCode);
};

/**
 * Merge Guest Cart into User's Account Cart upon Login
 * Follows exact specifications:
 * - Validates every product in DB
 * - Discards deleted/inactive products
 * - Merges duplicate products: userQty + guestQty clamped to stock
 * - Adds new products clamped to stock
 * - Returns final hydrated cart
 */
const mergeGuestCart = async (userId, guestItems = [], couponCode = null) => {
  if (!Array.isArray(guestItems) || guestItems.length === 0) {
    const cart = await getOrCreateUserCart(userId);
    return hydrateCart(cart.items, cart.savedForLater, couponCode);
  }

  const cart = await getOrCreateUserCart(userId);
  const itemMap = new Map();

  // Load existing user items into map
  cart.items.forEach((item) => {
    const pId = item.productId || item.id;
    if (pId) {
      itemMap.set(pId, {
        productId: pId,
        quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
        addedAt: item.addedAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      });
    }
  });

  // Query DB for all products in guest cart to ensure stock and existence
  const guestProductIds = guestItems.map((g) => g.productId || g.id).filter(Boolean);
  if (guestProductIds.length > 0) {
    const pRes = await db.query(
      'SELECT id, stock, is_active FROM products WHERE id = ANY($1::varchar[])',
      [guestProductIds]
    );

    const validProductStockMap = new Map();
    pRes.rows.forEach((p) => {
      if (p.is_active !== false) {
        validProductStockMap.set(p.id, parseInt(p.stock, 10) ?? 50);
      }
    });

    // Merge each guest item
    guestItems.forEach((gItem) => {
      const pId = gItem.productId || gItem.id;
      if (!pId || !validProductStockMap.has(pId)) return; // skip unavailable or non-existent

      const maxStock = validProductStockMap.get(pId);
      if (maxStock <= 0) return; // out of stock

      const guestQty = Math.max(1, parseInt(gItem.quantity, 10) || 1);

      if (itemMap.has(pId)) {
        const existing = itemMap.get(pId);
        const mergedQty = Math.min(maxStock, existing.quantity + guestQty);
        itemMap.set(pId, {
          ...existing,
          quantity: mergedQty,
          updatedAt: new Date().toISOString(),
        });
      } else {
        const initialQty = Math.min(maxStock, guestQty);
        itemMap.set(pId, {
          productId: pId,
          quantity: initialQty,
          addedAt: gItem.addedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });
  }

  const mergedItems = Array.from(itemMap.values());
  await saveUserCart(userId, mergedItems, cart.savedForLater);
  return hydrateCart(mergedItems, cart.savedForLater, couponCode);
};

/**
 * Remove purchased items from cart after successful checkout
 */
const clearPurchasedItems = async (userId, purchasedProductIds = []) => {
  if (!userId || !Array.isArray(purchasedProductIds) || purchasedProductIds.length === 0) {
    return;
  }
  const cart = await getOrCreateUserCart(userId);
  const purchasedSet = new Set(purchasedProductIds.map(String));
  const remainingItems = cart.items.filter((i) => !purchasedSet.has(String(i.productId || i.id)));
  await saveUserCart(userId, remainingItems, cart.savedForLater);
};

module.exports = {
  COUPONS,
  getOrCreateUserCart,
  hydrateCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  saveForLater,
  moveToCart,
  removeSavedItem,
  mergeGuestCart,
  clearPurchasedItems,
};

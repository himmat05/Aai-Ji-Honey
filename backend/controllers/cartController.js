const cartService = require('../services/cartService');

/**
 * GET /api/cart
 * Get current authenticated user's cart (fully hydrated with live prices and stock)
 */
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const couponCode = req.query.coupon || null;
    const userCart = await cartService.getOrCreateUserCart(userId);
    const hydrated = await cartService.hydrateCart(userCart.items, userCart.savedForLater, couponCode);

    res.json({
      success: true,
      message: 'Cart fetched successfully',
      data: hydrated,
    });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: err.message,
    });
  }
};

/**
 * POST /api/cart/items
 * Add an item to user's cart
 */
const addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, coupon } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
        code: 'MISSING_PRODUCT_ID',
      });
    }

    const hydrated = await cartService.addItem(userId, productId, quantity || 1, coupon);

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: hydrated,
    });
  } catch (err) {
    console.error('Error adding item to cart:', err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Failed to add item to cart',
      code: err.code || 'CART_ADD_ERROR',
      details: err.details || null,
    });
  }
};

/**
 * PATCH /api/cart/items/:productId
 * Update quantity of an item in user's cart
 */
const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity, coupon } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required',
        code: 'MISSING_QUANTITY',
      });
    }

    const hydrated = await cartService.updateQuantity(userId, productId, quantity, coupon);

    res.json({
      success: true,
      message: 'Cart quantity updated',
      data: hydrated,
    });
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Failed to update quantity',
      code: err.code || 'CART_UPDATE_ERROR',
      details: err.details || null,
    });
  }
};

/**
 * DELETE /api/cart/items/:productId
 * Remove an item from user's cart
 */
const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const couponCode = req.query.coupon || null;

    const hydrated = await cartService.removeItem(userId, productId, couponCode);

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: hydrated,
    });
  } catch (err) {
    console.error('Error removing item from cart:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: err.message,
    });
  }
};

/**
 * DELETE /api/cart
 * Clear all items from user's cart
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const hydrated = await cartService.clearCart(userId);

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: hydrated,
    });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: err.message,
    });
  }
};

/**
 * POST /api/cart/save-for-later/:productId
 * Move item from Cart to Saved for Later
 */
const saveForLater = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const coupon = req.body.coupon || null;

    const hydrated = await cartService.saveForLater(userId, productId, coupon);

    res.json({
      success: true,
      message: 'Item moved to Saved for Later',
      data: hydrated,
    });
  } catch (err) {
    console.error('Error saving item for later:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to save item for later',
      error: err.message,
    });
  }
};

/**
 * POST /api/cart/move-to-cart/:productId
 * Move item from Saved for Later back to Cart
 */
const moveToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const coupon = req.body.coupon || null;

    const hydrated = await cartService.moveToCart(userId, productId, coupon);

    res.json({
      success: true,
      message: 'Item moved back to Cart',
      data: hydrated,
    });
  } catch (err) {
    console.error('Error moving item to cart:', err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Failed to move item to cart',
      code: err.code || 'MOVE_TO_CART_ERROR',
    });
  }
};

/**
 * DELETE /api/cart/saved/:productId
 * Remove an item from Saved for Later
 */
const removeSavedItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const coupon = req.query.coupon || null;

    const hydrated = await cartService.removeSavedItem(userId, productId, coupon);

    res.json({
      success: true,
      message: 'Item removed from Saved for Later',
      data: hydrated,
    });
  } catch (err) {
    console.error('Error removing saved item:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to remove saved item',
      error: err.message,
    });
  }
};

/**
 * POST /api/cart/merge
 * Merge Guest Cart into User's Account Cart upon login
 */
const mergeGuestCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, coupon } = req.body;

    const hydrated = await cartService.mergeGuestCart(userId, items || [], coupon);

    res.json({
      success: true,
      message: 'Guest cart merged successfully',
      data: hydrated,
    });
  } catch (err) {
    console.error('Error merging guest cart:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to merge cart',
      error: err.message,
    });
  }
};

/**
 * POST /api/cart/validate
 * Public or Authenticated endpoint to validate any cart (Guest or User) before checkout.
 * Checks stock, product availability, recalculates prices, taxes, and shipping.
 */
const validateCart = async (req, res) => {
  try {
    const { items, savedForLater, coupon } = req.body;

    let itemsToValidate = items;
    let savedToValidate = savedForLater || [];

    // If no items passed in body, but user is authenticated, validate user's DB cart
    if (!Array.isArray(itemsToValidate) && req.user?.id) {
      const userCart = await cartService.getOrCreateUserCart(req.user.id);
      itemsToValidate = userCart.items;
      savedToValidate = userCart.savedForLater;
    }

    const hydrated = await cartService.hydrateCart(
      Array.isArray(itemsToValidate) ? itemsToValidate : [],
      Array.isArray(savedToValidate) ? savedToValidate : [],
      coupon || null
    );

    res.json({
      success: true,
      valid: hydrated.isValidForCheckout,
      changes: hydrated.changes,
      data: hydrated,
    });
  } catch (err) {
    console.error('Error validating cart:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to validate cart',
      error: err.message,
    });
  }
};

/**
 * GET /api/cart/coupons
 * List available public promotions
 */
const getAvailableCoupons = async (req, res) => {
  try {
    const couponService = require('../services/couponService');
    const coupons = await couponService.getActiveCoupons();
    res.json({
      success: true,
      coupons: coupons.map((c) => ({
        id: c.id,
        code: c.code,
        discount_percentage: c.discount_percentage,
        min_order_amount: parseFloat(c.min_order_amount) || 0,
        max_discount: c.max_discount ? parseFloat(c.max_discount) : null,
        description: c.description,
      })),
    });
  } catch (err) {
    console.error('Error fetching cart coupons:', err);
    res.status(500).json({ success: false, coupons: [] });
  }
};

module.exports = {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  saveForLater,
  moveToCart,
  removeSavedItem,
  mergeGuestCart,
  validateCart,
  getAvailableCoupons,
};

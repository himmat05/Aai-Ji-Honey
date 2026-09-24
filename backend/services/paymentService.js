const crypto = require('crypto');
const db = require('../config/db');
const razorpay = require('../config/razorpay');

/**
 * Create a new Razorpay order with server-calculated amount
 * Strictly validates product in NeonDB to prevent amount tampering
 * @param {string} productId - ID of product in database
 * @param {number} quantity - Quantity of items
 * @returns {Promise<Object>} Razorpay order details + verified product
 */
const createRazorpayOrder = async (productId, quantity = 1) => {
  if (!productId) {
    throw new Error('Product ID is required');
  }

  const cleanQuantity = Math.max(1, Math.min(100, parseInt(quantity, 10) || 1));

  // Query product directly from NeonDB to guarantee price integrity
  const productResult = await db.query(
    'SELECT id, name, price, image, flavour FROM products WHERE id = $1',
    [productId]
  );

  if (productResult.rows.length === 0) {
    throw new Error('Product not found');
  }

  const product = productResult.rows[0];
  const unitPrice = parseFloat(product.price);
  if (isNaN(unitPrice) || unitPrice <= 0) {
    throw new Error('Invalid product price configuration in database');
  }

  // Calculate total in paise server-side (Never trust client-provided amount)
  const totalAmountInPaise = Math.round(unitPrice * cleanQuantity * 100);

  const options = {
    amount: totalAmountInPaise,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    notes: {
      productId: product.id,
      productName: product.name,
      quantity: String(cleanQuantity),
    },
  };

  const razorpayOrder = await razorpay.orders.create(options);

  return {
    order: razorpayOrder,
    product: {
      id: product.id,
      name: product.name,
      price: unitPrice,
      totalPrice: unitPrice * cleanQuantity,
      image: product.image,
      flavour: product.flavour,
    },
    quantity: cleanQuantity,
  };
};

/**
 * Create a new Razorpay order for multi-item Cart or Buy Now checkout
 * Validates all products, stock, coupon, tax, shipping server-side
 */
const createCartRazorpayOrder = async (items = [], couponCode = null) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('At least one item is required to initiate checkout');
  }

  const cartService = require('./cartService');
  const hydrated = await cartService.hydrateCart(items, [], couponCode);

  if (!hydrated.isValidForCheckout || hydrated.items.length === 0) {
    const errorMsg =
      hydrated.changes.length > 0
        ? hydrated.changes.map((c) => c.message).join(' ')
        : 'One or more items in your order are unavailable or have insufficient stock.';
    const err = new Error(errorMsg);
    err.code = 'INVALID_CHECKOUT_STATE';
    err.status = 400;
    throw err;
  }

  const totalInPaise = Math.round(hydrated.total * 100);
  if (totalInPaise <= 0) {
    throw new Error('Invalid order total');
  }

  const options = {
    amount: totalInPaise,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    notes: {
      itemCount: String(hydrated.itemCount),
      coupon: hydrated.appliedCoupon ? hydrated.appliedCoupon.code : 'NONE',
    },
  };

  const razorpayOrder = await razorpay.orders.create(options);

  return {
    order: razorpayOrder,
    hydratedSummary: hydrated,
  };
};

/**
 * Verify Razorpay payment signature in constant-time (Timing-attack immune)
 * @param {string} orderId
 * @param {string} paymentId
 * @param {string} signature
 * @returns {boolean} isValid
 */
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  if (!orderId || !paymentId || !signature) {
    return false;
  }
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  const expectedBuf = Buffer.from(expectedSignature, 'utf8');
  const signatureBuf = Buffer.from(signature, 'utf8');

  if (expectedBuf.length !== signatureBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, signatureBuf);
};

/**
 * Verify Razorpay webhook signature in constant time
 * @param {string|Buffer|Object} rawBody
 * @param {string} signature
 * @returns {boolean} isValid
 */
const verifyWebhookSignature = (rawBody, signature) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !rawBody || !signature) {
    return false;
  }

  const payload = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  const expectedBuf = Buffer.from(expectedSignature, 'utf8');
  const signatureBuf = Buffer.from(signature, 'utf8');

  if (expectedBuf.length !== signatureBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, signatureBuf);
};

module.exports = {
  createRazorpayOrder,
  createCartRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
};

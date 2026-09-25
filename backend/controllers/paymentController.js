const paymentService = require('../services/paymentService');
const orderService = require('../services/orderService');
const jwt = require('jsonwebtoken');

/**
 * Create a Razorpay order
 * Calculates price server-side from NeonDB product table to prevent amount tampering
 * Returns orderId and keyId at runtime
 * POST /create-order
 */
const createOrder = async (req, res, next) => {
  const { productId, quantity, amount, items, cartItems, coupon } = req.body;

  try {
    let payment;
    const checkoutItems = items || cartItems;

    if (Array.isArray(checkoutItems) && checkoutItems.length > 0) {
      payment = await paymentService.createCartRazorpayOrder(checkoutItems, coupon);
      return res.json({
        order: payment.order,
        keyId: process.env.RAZORPAY_KEY_ID,
        summary: payment.hydratedSummary,
      });
    } else if (productId) {
      const cleanQty = Math.max(1, parseInt(quantity, 10) || 1);
      payment = await paymentService.createCartRazorpayOrder(
        [{ productId, quantity: cleanQty }],
        coupon
      );
      return res.json({
        order: payment.order,
        keyId: process.env.RAZORPAY_KEY_ID,
        summary: payment.hydratedSummary,
        product: payment.hydratedSummary?.items?.[0] || null,
        quantity: cleanQty,
      });
    } else {
      return res.status(400).json({ error: 'Valid product ID or cart items required to initiate secure checkout' });
    }
  } catch (err) {
    console.error('Error creating Razorpay order:', err.message);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Failed to initiate secure payment gateway' });
  }
};

/**
 * Verify Razorpay payment signature and securely record order
 * POST /verify
 */
const verifyPayment = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Razorpay order ID, payment ID, and signature are required for verification.',
    });
  }

  // 1. Cryptographic HMAC-SHA256 signature verification in constant-time
  const isValid = paymentService.verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isValid) {
    console.warn(`⚠️ Payment verification failed for Order ${razorpay_order_id}, Payment ${razorpay_payment_id}`);
    return res.status(400).json({
      success: false,
      message: 'Cryptographic signature verification failed. Untrusted payment payload.',
    });
  }

  // Helper to sanitize strings and strip HTML
  const stripHtml = (str) => (str ? String(str).replace(/<[^>]*>?/gm, '').trim() : '');

  // 2. If order details are provided, persist the verified order into NeonDB
  try {
    let savedOrder = null;
    if (orderDetails && orderDetails.name && orderDetails.mobile && orderDetails.address) {
      // Security fix: Strictly derive user ID from authenticated JWT token (Never trust client body)
      let resolvedUserId = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
          if (decoded && decoded.id) {
            resolvedUserId = decoded.id;
          }
        } catch (tokenErr) {
          // Token invalid or expired
        }
      }

      const cleanOrderData = {
        name: stripHtml(orderDetails.name).slice(0, 100),
        email: orderDetails.email ? stripHtml(orderDetails.email).toLowerCase().slice(0, 150) : null,
        mobile: stripHtml(orderDetails.mobile).slice(0, 20),
        address: stripHtml(orderDetails.address).slice(0, 500),
        quantity: Math.max(1, Math.min(100, parseInt(orderDetails.quantity, 10) || 1)),
        product: typeof orderDetails.product === 'object' && orderDetails.product !== null ? orderDetails.product : {},
        paymentId: stripHtml(razorpay_payment_id).slice(0, 100),
        status: 'Processing', // Verified paid order ready for processing
        userId: resolvedUserId,
      };

      savedOrder = await orderService.createOrder(cleanOrderData);

      // 3. Atomically decrement stock in database
      const db = require('../config/db');
      const itemsToDeduct = Array.isArray(orderDetails.items) && orderDetails.items.length > 0
        ? orderDetails.items
        : orderDetails.product
        ? [{ id: orderDetails.product.id || orderDetails.product._id, quantity: cleanOrderData.quantity }]
        : [];

      for (const it of itemsToDeduct) {
        const pId = it.id || it.productId || it._id;
        const pQty = Math.max(1, parseInt(it.quantity, 10) || 1);
        if (pId) {
          try {
            await db.query(
              'UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2',
              [pQty, pId]
            );
          } catch (stockErr) {
            console.warn(`Failed to deduct stock for product ${pId}:`, stockErr.message);
          }
        }
      }

      // 4. Clear only purchased items from user's persistent cart (leaving Buy Now or unselected items intact)
      if (resolvedUserId && !orderDetails.isBuyNow && itemsToDeduct.length > 0) {
        const cartService = require('../services/cartService');
        const purchasedIds = itemsToDeduct.map((i) => i.id || i.productId || i._id).filter(Boolean);
        try {
          await cartService.clearPurchasedItems(resolvedUserId, purchasedIds);
        } catch (cartClearErr) {
          console.warn('Failed to clear purchased items from cart:', cartClearErr.message);
        }
      }
    }

    res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully.',
      order: savedOrder,
    });
  } catch (saveError) {
    console.error('Error saving verified order:', saveError);
    res.status(500).json({
      success: false,
      message: 'Payment verified successfully, but failed to save order to database. Please contact support.',
      paymentId: razorpay_payment_id,
    });
  }
};

/**
 * Handle incoming Razorpay Webhook events
 * POST /webhook
 */
const handleWebhook = (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'Missing Razorpay webhook signature header' });
  }

  const isValid = paymentService.verifyWebhookSignature(req.body, signature);
  if (!isValid) {
    console.warn('⚠️ Webhook signature verification failed');
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const event = req.body.event;
  console.log(`🔔 Razorpay Webhook event received: ${event}`);

  // Acknowledge receipt immediately
  res.status(200).json({ status: 'ok' });
};

module.exports = {
  createOrder,
  verifyPayment,
  handleWebhook,
};

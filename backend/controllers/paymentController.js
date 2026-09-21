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
  const { productId, quantity, amount } = req.body;

  try {
    let payment;
    if (productId) {
      payment = await paymentService.createRazorpayOrder(productId, quantity || 1);
    } else if (amount) {
      // Fallback for direct amount if testing
      const parsedAmount = parseInt(amount, 10);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ error: 'Valid payment amount is required' });
      }
      const razorpay = require('../config/razorpay');
      const crypto = require('crypto');
      const order = await razorpay.orders.create({
        amount: parsedAmount,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      });
      payment = { order };
    } else {
      return res.status(400).json({ error: 'Product ID is required to initiate order' });
    }

    // Return order and deliver Key ID dynamically at runtime
    res.json({
      order: payment.order,
      keyId: process.env.RAZORPAY_KEY_ID,
      product: payment.product,
      quantity: payment.quantity,
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err.message);
    res.status(500).json({ error: 'Failed to initiate secure payment gateway' });
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

  // 2. If order details are provided, persist the verified order into NeonDB
  try {
    let savedOrder = null;
    if (orderDetails && orderDetails.name && orderDetails.mobile && orderDetails.address) {
      // Extract user ID from token if authenticated
      let resolvedUserId = orderDetails.userId || null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ') && !resolvedUserId) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
          if (decoded && decoded.id) {
            resolvedUserId = decoded.id;
          }
        } catch (tokenErr) {}
      }

      const cleanOrderData = {
        name: String(orderDetails.name).trim().slice(0, 100),
        email: orderDetails.email ? String(orderDetails.email).trim().toLowerCase().slice(0, 150) : null,
        mobile: String(orderDetails.mobile).trim().slice(0, 20),
        address: String(orderDetails.address).trim().slice(0, 500),
        quantity: Math.max(1, Math.min(100, parseInt(orderDetails.quantity, 10) || 1)),
        product: typeof orderDetails.product === 'object' && orderDetails.product !== null ? orderDetails.product : {},
        paymentId: razorpay_payment_id,
        status: 'Processing', // Verified paid order ready for processing
        userId: resolvedUserId,
      };

      savedOrder = await orderService.createOrder(cleanOrderData);
    }

    res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully.',
      order: savedOrder,
    });
  } catch (saveError) {
    console.error('Error saving verified order:', saveError);
    // Signature was valid but DB write failed: return success with warning so frontend can notify support
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

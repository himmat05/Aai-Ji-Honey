const paymentService = require('../services/paymentService');

/**
 * Create a Razorpay order
 * POST /create-order
 */
const createOrder = async (req, res, next) => {
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  try {
    const payment = await paymentService.createRazorpayOrder(amount);
    res.json({ order: payment });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ error: 'Payment creation failed' });
  }
};

/**
 * Verify Razorpay payment signature
 * POST /verify
 */
const verifyPayment = (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const isValid = paymentService.verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (isValid) {
    // Payment verified
    res.json({ success: true });
  } else {
    // Payment tampered or fake
    res.status(400).json({ success: false, message: 'Signature verification failed' });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};

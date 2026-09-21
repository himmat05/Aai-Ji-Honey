const crypto = require('crypto');
const razorpay = require('../config/razorpay');

/**
 * Create a new Razorpay order
 * @param {number} amount - Amount in paise
 * @returns {Promise<Object>} Razorpay order
 */
const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount, // amount in paise
    currency: 'INR',
    receipt: 'receipt_' + Math.random().toString(36).substring(2)
  };
  return await razorpay.orders.create(options);
};

/**
 * Verify Razorpay payment signature
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
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature
};

const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, handleWebhook } = require('../controllers/paymentController');
const { paymentLimiter } = require('../middleware/rateLimiter');

// Rate-limited payment creation and verification
router.post('/create-order', paymentLimiter, createOrder);
router.post('/verify', paymentLimiter, verifyPayment);
router.post('/webhook', handleWebhook);

module.exports = router;

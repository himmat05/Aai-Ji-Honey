const rateLimit = require('express-rate-limit');

/**
 * General API Limiter: 300 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Strict Auth Limiter: 20 attempts per 15 minutes per IP
 * Protects login, registration, OTP generation, and password resets against brute force
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts from this IP. Please wait 15 minutes and try again.',
  },
});

/**
 * Payment & Checkout Limiter: 40 requests per 15 minutes per IP
 * Protects Razorpay order creation and signature verification against card-testing bots
 */
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many payment requests from this IP. Please wait 15 minutes and try again.',
  },
});

/**
 * Career & Job Application Limiter: 10 applications per hour per IP
 * Protects resume upload storage from spam flood and bots
 */
const careerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many job applications from this network. Please wait an hour before submitting another.',
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  paymentLimiter,
  careerLimiter,
};

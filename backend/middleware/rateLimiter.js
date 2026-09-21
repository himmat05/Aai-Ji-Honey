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

module.exports = {
  generalLimiter,
  authLimiter,
};

const express = require('express');
const router = express.Router();
const { registerOwner, login } = require('../controllers/authController');
const {
  sendSignupOtp,
  verifySignupOtp,
  userLogin,
  googleAuth,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
  updateProfile,
  getMe,
} = require('../controllers/customerAuthController');
const { authLimiter } = require('../middleware/rateLimiter');

// ==========================================
// Authentication Routes (Rate-limited)
// ==========================================
// Unified Login (Admin & Customer)
router.post('/login', authLimiter, login);
router.post('/api/login', authLimiter, login);
router.post('/auth/login', authLimiter, login);
router.post('/auth/user-login', authLimiter, login);
router.post('/user-login', authLimiter, login);
router.post('/register-owner', authLimiter, registerOwner);

// Customer Signup with Email OTP
router.post('/auth/send-signup-otp', authLimiter, sendSignupOtp);
router.post('/send-signup-otp', authLimiter, sendSignupOtp);

router.post('/auth/verify-signup-otp', authLimiter, verifySignupOtp);
router.post('/verify-signup-otp', authLimiter, verifySignupOtp);

// Google OAuth Login / Signup
router.post('/auth/google', authLimiter, googleAuth);
router.post('/google', authLimiter, googleAuth);

// Forgot Password with Email OTP
router.post('/auth/forgot-password/send-otp', authLimiter, sendForgotPasswordOtp);
router.post('/forgot-password/send-otp', authLimiter, sendForgotPasswordOtp);

router.post('/auth/forgot-password/reset', authLimiter, resetPasswordWithOtp);
router.post('/forgot-password/reset', authLimiter, resetPasswordWithOtp);

// Active User Profile
router.get('/auth/me', getMe);
router.get('/me', getMe);

// Update Profile
router.put('/auth/profile', updateProfile);
router.put('/profile', updateProfile);

module.exports = router;

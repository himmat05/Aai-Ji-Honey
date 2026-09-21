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

// ==========================================
// Owner Authentication Routes (Admin)
// ==========================================
// Unified Login (Admin & Customer)
router.post('/login', login);
router.post('/api/login', login);
router.post('/auth/login', login);
router.post('/auth/user-login', login);
router.post('/user-login', login);
router.post('/register-owner', registerOwner);

// Customer Signup with Email OTP
router.post('/auth/send-signup-otp', sendSignupOtp);
router.post('/send-signup-otp', sendSignupOtp);

router.post('/auth/verify-signup-otp', verifySignupOtp);
router.post('/verify-signup-otp', verifySignupOtp);

// Google OAuth Login / Signup
router.post('/auth/google', googleAuth);
router.post('/google', googleAuth);

// Forgot Password with Email OTP
router.post('/auth/forgot-password/send-otp', sendForgotPasswordOtp);
router.post('/forgot-password/send-otp', sendForgotPasswordOtp);

router.post('/auth/forgot-password/reset', resetPasswordWithOtp);
router.post('/forgot-password/reset', resetPasswordWithOtp);

// Active User Profile
router.get('/auth/me', getMe);
router.get('/me', getMe);

// Update Profile
router.put('/auth/profile', updateProfile);
router.put('/profile', updateProfile);

module.exports = router;

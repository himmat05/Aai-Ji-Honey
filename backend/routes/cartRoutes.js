const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

// Optional auth middleware for endpoints that can serve both guest and authenticated users
const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, user) => {
    if (!err && user) {
      req.user = user;
    }
    next();
  });
};

// Public promotion list
router.get('/coupons', cartController.getAvailableCoupons);

// Cart validation (Strictly Authenticated)
router.post('/validate', authenticateToken, cartController.validateCart);

// Authenticated Cart Operations
router.get('/', authenticateToken, cartController.getCart);
router.post('/items', authenticateToken, cartController.addItem);
router.patch('/items/:productId', authenticateToken, cartController.updateQuantity);
router.delete('/items/:productId', authenticateToken, cartController.removeItem);
router.delete('/', authenticateToken, cartController.clearCart);

// Saved for Later
router.post('/save-for-later/:productId', authenticateToken, cartController.saveForLater);
router.post('/move-to-cart/:productId', authenticateToken, cartController.moveToCart);
router.delete('/saved/:productId', authenticateToken, cartController.removeSavedItem);

// Guest -> User Cart Merge upon login
router.post('/merge', authenticateToken, cartController.mergeGuestCart);

module.exports = router;

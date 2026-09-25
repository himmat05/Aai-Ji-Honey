const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

// Public route: active promo codes for shoppers
router.get('/', couponController.getPublicCoupons);
router.post('/validate', couponController.validateCoupon);

// Admin routes: strictly protected for store administrators / owner
router.get('/admin', authenticateToken, requireAdmin, couponController.getAdminCoupons);
router.post('/admin', authenticateToken, requireAdmin, couponController.createCoupon);
router.delete('/admin/:id', authenticateToken, requireAdmin, couponController.deleteCoupon);
router.patch('/admin/:id/toggle', authenticateToken, requireAdmin, couponController.toggleCouponStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  getAdminReviews,
  deleteReview,
  toggleReviewApproval,
} = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public endpoints
router.get('/', getReviews);
router.post('/', upload.single('image'), createReview);

// Admin-only endpoints
router.get('/admin', authenticateToken, requireAdmin, getAdminReviews);
router.delete('/:id', authenticateToken, requireAdmin, deleteReview);
router.patch('/:id/toggle-approval', authenticateToken, requireAdmin, toggleReviewApproval);

module.exports = router;

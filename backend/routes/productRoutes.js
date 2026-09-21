const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  rateProduct,
  getUserProductRating,
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllProducts);
router.post('/', authenticateToken, requireAdmin, upload.single('image'), createProduct);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

// Product Rating endpoints
router.post('/:id/rate', authenticateToken, rateProduct);
router.get('/:id/my-rating', authenticateToken, getUserProductRating);

module.exports = router;

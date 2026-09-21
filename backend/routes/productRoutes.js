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
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllProducts);
router.post('/', authenticateToken, upload.single('image'), createProduct);
router.put('/:id', authenticateToken, upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

// Product Rating endpoints
router.post('/:id/rate', authenticateToken, rateProduct);
router.get('/:id/my-rating', authenticateToken, getUserProductRating);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllGalleryItems);
router.post('/', authenticateToken, requireAdmin, upload.single('image'), createGalleryItem);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), updateGalleryItem);
router.delete('/:id', authenticateToken, requireAdmin, deleteGalleryItem);

module.exports = router;

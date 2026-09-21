const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

// Customer specific order routes (requires authentication)
router.get('/my-orders', authenticateToken, getMyOrders);

// Place an order (public / authenticated checkout)
router.post('/', createOrder);

// Admin order management routes (strictly require admin role)
router.get('/', authenticateToken, requireAdmin, getOrders);
router.patch('/:id', authenticateToken, requireAdmin, updateOrderStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteOrder);

module.exports = router;

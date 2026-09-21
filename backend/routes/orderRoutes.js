const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

// Customer specific order routes
router.get('/my-orders', getMyOrders);

// General order management routes
router.post('/', createOrder);
router.get('/', getOrders);
router.patch('/:id', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;

const jwt = require('jsonwebtoken');
const orderService = require('../services/orderService');

/**
 * Place a new customer order
 * POST /orders
 */
const createOrder = async (req, res, next) => {
  try {
    // Anti-bot honeypot check
    if (req.body.website_url || req.body.bot_trap || req.body.honeypot) {
      console.warn('🤖 Anti-bot honeypot triggered on checkout/order creation.');
      return res.status(200).json({ message: 'Order submitted.' });
    }

    const { name, email, mobile, address, quantity, product, paymentId } = req.body;
    if (!name || !mobile || !address) {
      return res.status(400).json({ message: 'Name, mobile, and address are required.' });
    }

    const stripHtml = (str) => (str ? String(str).replace(/<[^>]*>?/gm, '').trim() : '');

    // Mass-assignment defense: pick only allowed fields, strip HTML, force status: 'Pending'
    const orderData = {
      name: stripHtml(name).slice(0, 100),
      email: email ? String(email).trim().toLowerCase().slice(0, 150) : null,
      mobile: stripHtml(mobile).slice(0, 20),
      address: stripHtml(address).slice(0, 500),
      quantity: Math.max(1, Math.min(100, parseInt(quantity, 10) || 1)),
      product: typeof product === 'object' && product !== null ? product : {},
      paymentId: paymentId ? stripHtml(paymentId).slice(0, 100) : null,
      status: 'Pending',
    };

    // Extract user ID from token if authenticated
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        if (decoded && decoded.id) {
          orderData.userId = decoded.id;
        }
      } catch (tokenErr) {
        // Continue even if token is not valid
      }
    }

    const order = await orderService.createOrder(orderData);
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ message: 'Error placing order' });
  }
};

/**
 * Get orders placed by current authenticated customer
 * GET /orders/my-orders
 */
const getMyOrders = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required to view orders' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const orders = await orderService.getOrdersByCustomer(decoded.id, decoded.email);
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching customer orders:', err.message);
    res.status(401).json({ message: 'Invalid or expired session' });
  }
};

/**
 * Get all orders (paginated) for owner dashboard
 * GET /orders
 */
const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const orders = await orderService.getOrders(page, limit);
    res.set('Cache-Control', 'private, max-age=5, stale-while-revalidate=15');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err });
  }
};

/**
 * Update order status
 * PATCH /orders/:id
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const { status } = req.body;
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    const updated = await orderService.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err });
  }
};

/**
 * Delete order
 * DELETE /orders/:id
 */
const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await orderService.deleteOrder(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.log('Delete request error for:', req.params.id);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  deleteOrder,
};

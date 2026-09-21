const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const productRoutes = require('./productRoutes');

// Root health check route
router.get('/', (req, res) => {
  res.send('API is working!');
});

// Mount modules at root level
router.use('/', authRoutes);
router.use('/', paymentRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);

// Mount modules with /api prefix for dual-compatibility
router.use('/api', authRoutes);
router.use('/api', paymentRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/products', productRoutes);

module.exports = router;

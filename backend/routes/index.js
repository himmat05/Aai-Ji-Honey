const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const productRoutes = require('./productRoutes');
const messageRoutes = require('./messageRoutes');
const galleryRoutes = require('./galleryRoutes');
const teamRoutes = require('./teamRoutes');

const db = require('../config/db');

// Health Check Controller (keeps both Render instance and Neon DB warm)
const healthCheck = async (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  try {
    // Quick query to keep Neon PostgreSQL connection pool awake
    await db.query('SELECT 1');
    return res.status(200).json({
      status: 'healthy',
      database: 'connected',
      uptime: `${uptimeSeconds}s`,
      timestamp: new Date().toISOString(),
      service: 'Aai Ji Honey Backend',
    });
  } catch (err) {
    console.warn('⚠️ Health check DB warning:', err.message);
    return res.status(200).json({
      status: 'degraded',
      database: 'reconnecting',
      uptime: `${uptimeSeconds}s`,
      timestamp: new Date().toISOString(),
      service: 'Aai Ji Honey Backend',
    });
  }
};

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: '🍯 Aai Ji Honey API Server is running smoothly',
  });
});

// Dedicated Health Endpoints for UptimeRobot / Ping Monitors (GET & HEAD)
router.all('/health', healthCheck);
router.all('/api/health', healthCheck);

// Mount modules at root level
router.use('/', authRoutes);
router.use('/', paymentRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/messages', messageRoutes);
router.use('/gallery', galleryRoutes);
router.use('/team', teamRoutes);

// Mount modules with /api prefix for dual-compatibility
router.use('/api', authRoutes);
router.use('/api', paymentRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/products', productRoutes);
router.use('/api/messages', messageRoutes);
router.use('/api/gallery', galleryRoutes);
router.use('/api/team', teamRoutes);

module.exports = router;


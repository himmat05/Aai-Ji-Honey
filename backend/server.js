const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB } = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');

// Initialize Neon PostgreSQL connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security HTTP Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false, // Prevents breaking inline scripts/CDNs while protecting X-Frame-Options, HSTS, X-Content-Type-Options
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS Security: Whitelist allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://aai-ji-honey.onrender.com',
  'https://aai-ji-honey-backend.onrender.com',
  'https://aaijihoney.com',
  'https://www.aaijihoney.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, uptime robot, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// General Rate Limiting (Exclude health check pings)
app.use((req, res, next) => {
  if (req.path === '/health' || req.path === '/api/health' || req.path === '/') {
    return next();
  }
  return generalLimiter(req, res, next);
});

// Request Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Application Routes
app.use('/', routes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Server Listener
app.listen(PORT, () => {
  console.log(`🚀 Aai Ji Honey API Server running on port ${PORT}`);
  if (process.env.GOOGLE_CLIENT_ID) {
    console.log(`🔑 Google OAuth Active: Client ID ${process.env.GOOGLE_CLIENT_ID.slice(0, 16)}...`);
  } else {
    console.log('⚠️ Google OAuth: GOOGLE_CLIENT_ID is not configured in .env');
  }
});

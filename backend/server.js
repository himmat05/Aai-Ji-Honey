const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
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
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);

// CORS Security: Whitelist allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
  'https://aai-ji-honey.vercel.app',
  'https://www.aai-ji-honey.vercel.app',
  'https://aai-ji-honey.onrender.com',
  'https://aai-ji-honey-frontend.onrender.com',
  'https://aai-ji-honey-backend.onrender.com',
  'https://aaijihoney.com',
  'https://www.aaijihoney.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, uptime robot, server-to-server)
    if (!origin) return callback(null, true);

    // Check exact allowed origins or any Vercel deployment of this project
    const isVercelDeploy =
      origin.endsWith('.vercel.app') &&
      (origin.includes('aai-ji-honey') || origin.includes('himmat05'));

    if (
      allowedOrigins.includes(origin) ||
      isVercelDeploy ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// General Rate Limiting (Exclude health check pings)
app.use((req, res, next) => {
  if (req.path === '/health' || req.path === '/api/health' || req.path === '/') {
    return next();
  }
  return generalLimiter(req, res, next);
});

// Enable Gzip/Brotli compression on all text & JSON responses (60-80% payload reduction)
app.use(compression());

// Request Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads', { maxAge: '7d', immutable: true }));

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

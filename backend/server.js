const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Initialize Neon PostgreSQL connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
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

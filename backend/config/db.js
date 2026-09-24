const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL is not set in .env! Please set your Neon PostgreSQL connection string.');
    return;
  }

  try {
    const client = await pool.connect();
    console.log('🐘 Neon PostgreSQL Connected successfully');

    // Ensure database tables exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS owners (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        image TEXT NOT NULL,
        offer INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        mobile VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        product JSONB NOT NULL,
        invoice_number VARCHAR(100) NOT NULL,
        payment_id VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        mobile VARCHAR(50),
        address TEXT,
        location VARCHAR(255),
        password VARCHAR(255),
        google_id VARCHAR(255) UNIQUE,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        purpose VARCHAR(50) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Idempotent column migrations for existing tables
      ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(255);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id VARCHAR(50);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS flavour VARCHAR(100);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INT DEFAULT 100;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS weight NUMERIC(10, 2);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_unit VARCHAR(20) DEFAULT 'g';
      UPDATE orders SET invoice_number = REPLACE(invoice_number, 'AJh/2027', 'AJh/2026') WHERE invoice_number LIKE '%2027%';

      CREATE TABLE IF NOT EXISTS carts (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) UNIQUE NOT NULL,
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        saved_for_later JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);

      CREATE TABLE IF NOT EXISTS product_ratings (
        id VARCHAR(50) PRIMARY KEY,
        product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        user_id VARCHAR(50) NOT NULL,
        user_name VARCHAR(255),
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (product_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        mobile VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        admin_reply TEXT,
        status VARCHAR(50) DEFAULT 'unread',
        is_read_by_admin BOOLEAN DEFAULT FALSE,
        is_read_by_user BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        replied_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS gallery_items (
        id VARCHAR(50) PRIMARY KEY,
        src TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        tag VARCHAR(100),
        description TEXT,
        order_num INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS team_members (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        badge VARCHAR(100),
        image TEXT NOT NULL,
        expertise TEXT NOT NULL,
        email VARCHAR(255),
        order_num INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS coupons (
        id VARCHAR(50) PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_percentage INT NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
        min_order_amount NUMERIC(10, 2) DEFAULT 0,
        max_discount NUMERIC(10, 2) DEFAULT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- High-Performance Database Indexes (Accelerates WHERE, JOIN, and ORDER BY queries)
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_invoice ON orders(invoice_number);
      CREATE INDEX IF NOT EXISTS idx_ratings_product_id ON product_ratings(product_id);
      CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_otps_email_purpose ON otps(email, purpose);
      CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
      CREATE INDEX IF NOT EXISTS idx_messages_email ON messages(email);
      CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_gallery_items_order ON gallery_items(order_num ASC, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_num ASC, created_at ASC);
      CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
      CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
    `);

    // Automatic idempotent initial seeding
    const { seedInitialData } = require('../utils/seeder');
    await seedInitialData(client);

    client.release();
  } catch (err) {
    console.error('❌ Neon PostgreSQL connection error:', err.message);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  connectDB,
};

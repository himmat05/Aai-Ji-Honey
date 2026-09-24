const crypto = require('crypto');
const db = require('../config/db');

/**
 * Get all promo codes (for Admin management)
 */
const getAllCoupons = async () => {
  const result = await db.query(
    'SELECT * FROM coupons ORDER BY created_at DESC'
  );
  return result.rows;
};

/**
 * Get all active promo codes (for Public Cart display)
 */
const getActiveCoupons = async () => {
  const result = await db.query(
    'SELECT id, code, discount_percentage, min_order_amount, max_discount, description, is_active FROM coupons WHERE is_active = TRUE ORDER BY discount_percentage DESC, created_at DESC'
  );
  return result.rows;
};

/**
 * Find active coupon by code
 */
const getCouponByCode = async (code) => {
  if (!code) return null;
  const normalized = String(code).trim().toUpperCase();
  const result = await db.query(
    'SELECT * FROM coupons WHERE UPPER(code) = $1 AND is_active = TRUE LIMIT 1',
    [normalized]
  );
  return result.rows[0] || null;
};

/**
 * Create a new coupon (Admin only)
 */
const createCoupon = async ({
  code,
  discountPercentage,
  minOrderAmount = 0,
  maxDiscount = null,
  description = '',
}) => {
  if (!code || typeof code !== 'string') {
    const err = new Error('Promo code is required');
    err.status = 400;
    throw err;
  }

  const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (cleanCode.length < 2 || cleanCode.length > 30) {
    const err = new Error('Promo code must be between 2 and 30 alphanumeric characters');
    err.status = 400;
    throw err;
  }

  const cleanPct = parseInt(discountPercentage, 10);
  if (isNaN(cleanPct) || cleanPct <= 0 || cleanPct > 100) {
    const err = new Error('Discount percentage must be a whole number between 1% and 100%');
    err.status = 400;
    throw err;
  }

  const cleanMinOrder = Math.max(0, parseFloat(minOrderAmount) || 0);
  const cleanMaxDiscount = maxDiscount ? Math.max(0, parseFloat(maxDiscount) || 0) : null;

  // Check uniqueness
  const existing = await db.query(
    'SELECT id FROM coupons WHERE UPPER(code) = $1 LIMIT 1',
    [cleanCode]
  );
  if (existing.rows.length > 0) {
    const err = new Error(`Promo code "${cleanCode}" already exists. Please use a unique code.`);
    err.status = 409;
    throw err;
  }

  const id = crypto.randomBytes(12).toString('hex');
  const insertResult = await db.query(
    `INSERT INTO coupons (id, code, discount_percentage, min_order_amount, max_discount, description, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, TRUE)
     RETURNING *`,
    [
      id,
      cleanCode,
      cleanPct,
      cleanMinOrder,
      cleanMaxDiscount,
      description.trim() || `${cleanPct}% OFF on all raw honey orders`,
    ]
  );

  return insertResult.rows[0];
};

/**
 * Delete a coupon by ID (Admin only)
 */
const deleteCoupon = async (id) => {
  if (!id) {
    const err = new Error('Coupon ID is required');
    err.status = 400;
    throw err;
  }

  const result = await db.query(
    'DELETE FROM coupons WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    const err = new Error('Coupon not found');
    err.status = 404;
    throw err;
  }

  return result.rows[0];
};

/**
 * Toggle coupon active/inactive status (Admin only)
 */
const toggleCouponActive = async (id) => {
  if (!id) {
    const err = new Error('Coupon ID is required');
    err.status = 400;
    throw err;
  }

  const result = await db.query(
    'UPDATE coupons SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    const err = new Error('Coupon not found');
    err.status = 404;
    throw err;
  }

  return result.rows[0];
};

module.exports = {
  getAllCoupons,
  getActiveCoupons,
  getCouponByCode,
  createCoupon,
  deleteCoupon,
  toggleCouponActive,
};

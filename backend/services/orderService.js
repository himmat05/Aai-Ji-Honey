const db = require('../config/db');
const crypto = require('crypto');

/**
 * Generate sequential invoice number
 * Format: AJh/{nextYear},{paddedCount}
 */
const generateInvoiceNumber = async () => {
  const res = await db.query('SELECT COUNT(*) FROM orders');
  const count = parseInt(res.rows[0].count, 10) || 0;
  const next = count + 1;
  const year = new Date().getFullYear();
  return `AJh/${year},${String(next).padStart(4, '0')}`;
};

/**
 * Create a new customer order in Neon PostgreSQL
 */
const createOrder = async (orderData) => {
  const invoiceNumber = await generateInvoiceNumber();
  const id = crypto.randomBytes(12).toString('hex'); // 24-char hex matches MongoDB ObjectId format

  const queryText = `
    INSERT INTO orders (id, name, email, mobile, address, quantity, product, invoice_number, payment_id, status, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id AS "_id", name, email, mobile, address, quantity, product, 
              invoice_number AS "invoiceNumber", payment_id AS "paymentId", 
              status, created_at AS "createdAt", user_id AS "userId"
  `;

  const values = [
    id,
    orderData.name,
    orderData.email || null,
    orderData.mobile,
    orderData.address,
    parseInt(orderData.quantity, 10) || 1,
    JSON.stringify(orderData.product || {}),
    invoiceNumber,
    orderData.paymentId || null,
    orderData.status || 'Pending',
    orderData.userId || orderData.user_id || null,
  ];

  const res = await db.query(queryText, values);
  const row = res.rows[0];
  if (row) {
    if (typeof row.product === 'string') {
      try { row.product = JSON.parse(row.product); } catch (e) { row.product = {}; }
    }
    if (row.product && row.product.price !== undefined) {
      row.product.price = parseFloat(row.product.price) || 0;
    }
  }
  return row;
};

/**
 * Get paginated orders from Neon PostgreSQL
 */
const getOrders = async (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const offset = (pageNum - 1) * limitNum;

  const queryText = `
    SELECT id AS "_id", name, email, mobile, address, quantity, product, 
           invoice_number AS "invoiceNumber", payment_id AS "paymentId", 
           status, created_at AS "createdAt"
    FROM orders
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const res = await db.query(queryText, [limitNum, offset]);
  return res.rows.map((o) => {
    let prod = o.product;
    if (typeof prod === 'string') {
      try {
        prod = JSON.parse(prod);
      } catch (e) {
        prod = {};
      }
    }
    if (prod && prod.price !== undefined) {
      prod.price = parseFloat(prod.price) || 0;
    }
    return {
      ...o,
      product: prod,
    };
  });
};

/**
 * Update order status
 */
const updateOrderStatus = async (id, status) => {
  const queryText = `
    UPDATE orders
    SET status = $1
    WHERE id = $2
    RETURNING id AS "_id", name, email, mobile, address, quantity, product, 
              invoice_number AS "invoiceNumber", payment_id AS "paymentId", 
              status, created_at AS "createdAt"
  `;
  const res = await db.query(queryText, [status, id]);
  const row = res.rows[0] || null;
  if (row) {
    if (typeof row.product === 'string') {
      try { row.product = JSON.parse(row.product); } catch (e) { row.product = {}; }
    }
    if (row.product && row.product.price !== undefined) {
      row.product.price = parseFloat(row.product.price) || 0;
    }
  }
  return row;
};

/**
 * Delete order by ID
 */
const deleteOrder = async (id) => {
  const res = await db.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
  return res.rows[0] || null;
};

/**
 * Get all orders placed by a specific customer (matching user_id or email)
 */
const getOrdersByCustomer = async (userId, email) => {
  const normalizedEmail = email ? email.toLowerCase().trim() : null;
  const queryText = `
    SELECT id AS "_id", name, email, mobile, address, quantity, product, 
           invoice_number AS "invoiceNumber", payment_id AS "paymentId", 
           status, created_at AS "createdAt", user_id AS "userId"
    FROM orders
    WHERE (user_id IS NOT NULL AND user_id = $1)
       OR (email IS NOT NULL AND LOWER(email) = LOWER($2))
    ORDER BY created_at DESC
  `;

  const res = await db.query(queryText, [userId || '', normalizedEmail || '']);
  return res.rows.map((o) => {
    let prod = o.product;
    if (typeof prod === 'string') {
      try { prod = JSON.parse(prod); } catch (e) { prod = {}; }
    }
    if (prod && prod.price !== undefined) {
      prod.price = parseFloat(prod.price) || 0;
    }
    return {
      ...o,
      product: prod,
    };
  });
};

module.exports = {
  generateInvoiceNumber,
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getOrdersByCustomer,
};

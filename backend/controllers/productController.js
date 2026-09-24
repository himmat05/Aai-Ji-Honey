const db = require('../config/db');
const crypto = require('crypto');

/**
 * Get all products
 * GET /products
 */
const getAllProducts = async (req, res, next) => {
  try {
    const queryText = `
      SELECT 
        p.id AS "_id", 
        p.name, 
        p.price, 
        p.image, 
        p.offer, 
        p.description, 
        p.flavour, 
        COALESCE(p.stock, 50)::int AS stock,
        COALESCE(p.is_active, true)::boolean AS "isActive",
        p.original_price AS "originalPrice",
        p.weight::float AS weight,
        COALESCE(p.weight_unit, 'g') AS "weightUnit",
        p.created_at AS "createdAt",
        COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float AS "avgRating",
        COUNT(r.id)::int AS "ratingCount"
      FROM products p
      LEFT JOIN product_ratings r ON p.id = r.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    const result = await db.query(queryText);
    const products = result.rows.map((p) => ({
      ...p,
      price: parseFloat(p.price) || 0,
      originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
      stock: parseInt(p.stock, 10) ?? 50,
      isActive: p.isActive !== false,
      weight: p.weight !== null && p.weight !== undefined ? parseFloat(p.weight) : null,
      weightUnit: p.weightUnit || 'g',
      avgRating: parseFloat(p.avgRating) || 0,
      ratingCount: parseInt(p.ratingCount, 10) || 0,
    }));

    // HTTP Caching: 60s fresh, 120s stale-while-revalidate for instant repeat loads
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

/**
 * Create a new product
 * POST /products (Protected, Multer)
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, flavour, stock, originalPrice, weight, weightUnit } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Product name is required (2-200 characters)' });
    }
    const cleanName = name.trim().slice(0, 200);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0 || parsedPrice > 1000000) {
      return res.status(400).json({ error: 'Valid positive selling price is required (up to ₹10,00,000)' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Product image is required' });
    }

    const id = crypto.randomBytes(12).toString('hex');
    const parsedStock = stock !== undefined 
      ? Math.max(0, Math.min(1000000, parseInt(stock, 10) || 0)) 
      : 50;

    let parsedOriginalPrice = null;
    if (originalPrice !== undefined && originalPrice !== null && String(originalPrice).trim() !== '') {
      parsedOriginalPrice = parseFloat(originalPrice);
      if (isNaN(parsedOriginalPrice) || parsedOriginalPrice <= 0) {
        return res.status(400).json({ error: 'Compare-at price must be a valid positive number' });
      }
      if (parsedOriginalPrice <= parsedPrice) {
        return res.status(400).json({ error: 'Compare-at price (MRP) must be strictly greater than selling price.' });
      }
    }

    let parsedWeight = null;
    if (weight !== undefined && weight !== null && String(weight).trim() !== '') {
      parsedWeight = parseFloat(weight);
      if (isNaN(parsedWeight) || parsedWeight <= 0) {
        return res.status(400).json({ error: 'Weight must be a positive number' });
      }
    }
    const cleanWeightUnit = (weightUnit && ['kg', 'g', 'gram'].includes(String(weightUnit).toLowerCase()))
      ? (String(weightUnit).toLowerCase() === 'kg' ? 'kg' : 'g')
      : 'g';

    const cleanFlavour = flavour ? String(flavour).trim().slice(0, 100) : null;
    const cleanDescription = description ? String(description).trim().slice(0, 2000) : null;

    const queryText = `
      INSERT INTO products (id, name, price, image, description, flavour, stock, original_price, weight, weight_unit)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING 
        id AS "_id", 
        name, 
        price, 
        image, 
        offer, 
        description, 
        flavour, 
        stock, 
        original_price AS "originalPrice",
        weight::float AS weight,
        COALESCE(weight_unit, 'g') AS "weightUnit",
        is_active AS "isActive",
        created_at AS "createdAt"
    `;

    const result = await db.query(queryText, [
      id,
      cleanName,
      parsedPrice,
      req.file.path,
      cleanDescription,
      cleanFlavour,
      parsedStock,
      parsedOriginalPrice,
      parsedWeight,
      cleanWeightUnit,
    ]);
    const created = result.rows[0];
    if (created) {
      created.price = parseFloat(created.price) || 0;
      created.originalPrice = parseFloat(created.originalPrice) || 0;
      created.stock = parseInt(created.stock, 10) ?? 50;
      created.weight = created.weight !== null && created.weight !== undefined ? parseFloat(created.weight) : null;
      created.weightUnit = created.weightUnit || 'g';
    }
    res.status(201).json(created);
  } catch (err) {
    console.error('Error in POST /products:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update an existing product
 * PUT /products/:id (Protected, Multer)
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description, flavour, stock, originalPrice, isActive, weight, weightUnit } = req.body;

    const findResult = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (findResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentProduct = findResult.rows[0];
    
    let newName = currentProduct.name;
    if (name !== undefined) {
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Product name cannot be empty' });
      }
      newName = name.trim().slice(0, 200);
    }

    let newPrice = currentProduct.price;
    if (price !== undefined) {
      const parsed = parseFloat(price);
      if (isNaN(parsed) || parsed <= 0 || parsed > 1000000) {
        return res.status(400).json({ error: 'Valid positive price is required' });
      }
      newPrice = parsed;
    }

    const newImage = req.file ? req.file.path : currentProduct.image;
    const newDescription = description !== undefined ? (description ? String(description).trim().slice(0, 2000) : null) : currentProduct.description;
    const newFlavour = flavour !== undefined ? (flavour ? String(flavour).trim().slice(0, 100) : null) : currentProduct.flavour;
    
    let newStock = currentProduct.stock ?? 50;
    if (stock !== undefined) {
      const parsedStock = parseInt(stock, 10);
      if (isNaN(parsedStock) || parsedStock < 0) {
        return res.status(400).json({ error: 'Stock must be a non-negative integer' });
      }
      newStock = Math.min(1000000, parsedStock);
    }

    let newOriginalPrice = currentProduct.original_price;
    if (originalPrice !== undefined) {
      if (originalPrice === null || originalPrice === '' || String(originalPrice).trim() === '') {
        newOriginalPrice = null;
      } else {
        const parsed = parseFloat(originalPrice);
        if (isNaN(parsed) || parsed <= 0) {
          return res.status(400).json({ error: 'Compare-at price must be a valid positive number' });
        }
        if (parsed <= newPrice) {
          return res.status(400).json({ error: 'Compare-at price (MRP) must be strictly greater than selling price.' });
        }
        newOriginalPrice = parsed;
      }
    }

    let newWeight = currentProduct.weight;
    if (weight !== undefined) {
      if (weight === null || weight === '' || String(weight).trim() === '') {
        newWeight = null;
      } else {
        const parsed = parseFloat(weight);
        if (isNaN(parsed) || parsed <= 0) {
          return res.status(400).json({ error: 'Weight must be a positive number' });
        }
        newWeight = parsed;
      }
    }

    let newWeightUnit = currentProduct.weight_unit || 'g';
    if (weightUnit !== undefined) {
      newWeightUnit = String(weightUnit).toLowerCase() === 'kg' ? 'kg' : 'g';
    }

    const newIsActive = isActive !== undefined ? Boolean(isActive) : (currentProduct.is_active !== false);

    const updateQuery = `
      UPDATE products
      SET 
        name = $1, 
        price = $2, 
        image = $3, 
        description = $4, 
        flavour = $5,
        stock = $6,
        original_price = $7,
        is_active = $8,
        weight = $9,
        weight_unit = $10
      WHERE id = $11
      RETURNING 
        id AS "_id", 
        name, 
        price, 
        image, 
        offer, 
        description, 
        flavour, 
        stock, 
        original_price AS "originalPrice",
        weight::float AS weight,
        COALESCE(weight_unit, 'g') AS "weightUnit",
        is_active AS "isActive",
        created_at AS "createdAt"
    `;

    const result = await db.query(updateQuery, [
      newName,
      newPrice,
      newImage,
      newDescription,
      newFlavour,
      newStock,
      newOriginalPrice,
      newIsActive,
      newWeight,
      newWeightUnit,
      id,
    ]);
    const updated = result.rows[0];
    if (updated) {
      updated.price = parseFloat(updated.price) || 0;
      updated.originalPrice = parseFloat(updated.originalPrice) || 0;
      updated.stock = parseInt(updated.stock, 10) ?? 50;
      updated.weight = updated.weight !== null && updated.weight !== undefined ? parseFloat(updated.weight) : null;
      updated.weightUnit = updated.weightUnit || 'g';
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete a product
 * DELETE /products/:id (Protected)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

/**
 * Rate a product (1 to 5 stars)
 * POST /products/:id/rate (Protected: user token)
 */
const rateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user?.id;
    const userName = req.user?.name || req.user?.email || 'Customer';

    if (!userId) {
      return res.status(401).json({ error: 'Please log in to rate this product' });
    }

    const parsedRating = parseInt(rating, 10);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5 stars' });
    }

    // Verify product exists by id or name
    const productCheck = await db.query(
      'SELECT id, name FROM products WHERE id = $1 OR name ILIKE $1 LIMIT 1',
      [id]
    );
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const targetProductId = productCheck.rows[0].id;
    const productName = productCheck.rows[0].name;

    // Verify user has purchased this product (unless admin)
    if (req.user?.role !== 'admin') {
      const orderCheck = await db.query(
        `SELECT id FROM orders 
         WHERE user_id = $1 
           AND (
             product->>'name' ILIKE $2 
             OR product->>'_id' = $3 
             OR product->>'id' = $3
           )
         LIMIT 1`,
        [userId, `%${productName}%`, targetProductId]
      );

      if (orderCheck.rows.length === 0) {
        return res.status(403).json({
          error: 'You can only rate honey products that you have ordered and purchased.',
        });
      }
    }

    const ratingId = crypto.randomBytes(12).toString('hex');

    // Upsert into product_ratings
    const upsertQuery = `
      INSERT INTO product_ratings (id, product_id, user_id, user_name, rating, review, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (product_id, user_id) 
      DO UPDATE SET 
        rating = EXCLUDED.rating, 
        review = EXCLUDED.review, 
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, product_id, user_id, rating, review
    `;

    const savedRating = await db.query(upsertQuery, [
      ratingId,
      targetProductId,
      userId,
      userName,
      parsedRating,
      review || null,
    ]);

    // Fetch updated aggregate
    const aggResult = await db.query(
      `SELECT 
         COALESCE(ROUND(AVG(rating)::numeric, 1), 0)::float AS "avgRating",
         COUNT(id)::int AS "ratingCount"
       FROM product_ratings
       WHERE product_id = $1`,
      [targetProductId]
    );

    res.json({
      message: 'Thank you for rating!',
      rating: savedRating.rows[0],
      avgRating: aggResult.rows[0]?.avgRating || parsedRating,
      ratingCount: aggResult.rows[0]?.ratingCount || 1,
    });
  } catch (err) {
    console.error('Error in rateProduct:', err);
    res.status(500).json({ error: err.message || 'Failed to submit rating' });
  }
};

/**
 * Get current user's rating for a product
 * GET /products/:id/my-rating (Protected: user token)
 */
const getUserProductRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.json({ rating: null });

    const prodCheck = await db.query(
      'SELECT id FROM products WHERE id = $1 OR name ILIKE $1 LIMIT 1',
      [id]
    );
    const targetProductId = prodCheck.rows[0]?.id || id;

    const result = await db.query(
      'SELECT rating, review FROM product_ratings WHERE product_id = $1 AND user_id = $2',
      [targetProductId, userId]
    );

    res.json(result.rows[0] || { rating: null });
  } catch (err) {
    console.error('Error fetching user rating:', err);
    res.status(500).json({ error: 'Failed to fetch user rating' });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  rateProduct,
  getUserProductRating,
};

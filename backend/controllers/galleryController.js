const db = require('../config/db');
const crypto = require('crypto');

/**
 * Get all gallery items
 * GET /gallery or /api/gallery (Public)
 */
const getAllGalleryItems = async (req, res) => {
  try {
    const queryText = `
      SELECT 
        id AS "_id",
        src,
        title,
        tag,
        description,
        order_num AS "orderNum",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM gallery_items
      ORDER BY order_num ASC, created_at DESC
    `;
    const result = await db.query(queryText);
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching gallery items:', err);
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
};

/**
 * Create a new gallery item
 * POST /gallery (Protected, Admin, Multer)
 */
const createGalleryItem = async (req, res) => {
  try {
    const { title, tag, description, orderNum } = req.body;
    const src = req.file ? req.file.path : req.body.src;

    if (!src) {
      return res.status(400).json({ error: 'Image file or image URL is required.' });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Gallery item title is required.' });
    }

    const id = crypto.randomBytes(12).toString('hex');
    const parsedOrder = parseInt(orderNum, 10) || 0;

    const queryText = `
      INSERT INTO gallery_items (id, src, title, tag, description, order_num)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id AS "_id", 
        src, 
        title, 
        tag, 
        description, 
        order_num AS "orderNum", 
        created_at AS "createdAt"
    `;

    const result = await db.query(queryText, [
      id,
      src.trim(),
      title.trim(),
      tag ? tag.trim() : null,
      description ? description.trim() : null,
      parsedOrder,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /gallery:', err);
    res.status(500).json({ error: err.message || 'Failed to create gallery item' });
  }
};

/**
 * Update an existing gallery item
 * PUT /gallery/:id (Protected, Admin, Multer)
 */
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tag, description, orderNum } = req.body;

    const findResult = await db.query('SELECT * FROM gallery_items WHERE id = $1', [id]);
    if (findResult.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    const currentItem = findResult.rows[0];
    const newSrc = req.file ? req.file.path : (req.body.src || currentItem.src);
    const newTitle = title !== undefined ? title.trim() : currentItem.title;
    const newTag = tag !== undefined ? tag.trim() : currentItem.tag;
    const newDescription = description !== undefined ? description.trim() : currentItem.description;
    const newOrder = orderNum !== undefined ? (parseInt(orderNum, 10) || 0) : currentItem.order_num;

    const updateQuery = `
      UPDATE gallery_items
      SET src = $1, title = $2, tag = $3, description = $4, order_num = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING 
        id AS "_id", 
        src, 
        title, 
        tag, 
        description, 
        order_num AS "orderNum", 
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    const result = await db.query(updateQuery, [
      newSrc,
      newTitle,
      newTag,
      newDescription,
      newOrder,
      id,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in PUT /gallery/:id:', err);
    res.status(500).json({ error: err.message || 'Failed to update gallery item' });
  }
};

/**
 * Delete a gallery item
 * DELETE /gallery/:id (Protected, Admin)
 */
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM gallery_items WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.json({ message: 'Gallery item deleted successfully', id });
  } catch (err) {
    console.error('Error in DELETE /gallery/:id:', err);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
};

module.exports = {
  getAllGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};

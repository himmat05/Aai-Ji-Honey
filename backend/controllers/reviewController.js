const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { cloudinary } = require('../config/cloudinary');
const { notifyAdminNewReview } = require('../services/emailService');

/**
 * Helper to strip HTML tags for anti-XSS protection
 */
const stripHtml = (str) => (str ? String(str).replace(/<[^>]*>?/gm, '').trim() : '');

/**
 * GET /api/reviews
 * Fetch public approved reviews with pagination, category filter, and stats
 */
const getReviews = async (req, res) => {
  try {
    const { category, minRating, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const conditions = ['is_approved = TRUE'];
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (minRating) {
      params.push(parseInt(minRating, 10));
      conditions.push(`rating >= $${params.length}`);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    // Query reviews list
    const query = `
      SELECT 
        id,
        user_name,
        location,
        rating,
        category,
        title,
        comment,
        image_url,
        badge_type,
        is_verified_buyer,
        created_at
      FROM reviews
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const result = await db.query(query, [...params, limitNum, offset]);

    // Aggregate statistics (Average rating, total reviews, star breakdown)
    const statsQuery = `
      SELECT 
        COUNT(*)::int AS total_count,
        COALESCE(ROUND(AVG(rating)::numeric, 1), 5.0)::float AS average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END)::int AS stars_5,
        COUNT(CASE WHEN rating = 4 THEN 1 END)::int AS stars_4,
        COUNT(CASE WHEN rating = 3 THEN 1 END)::int AS stars_3,
        COUNT(CASE WHEN rating = 2 THEN 1 END)::int AS stars_2,
        COUNT(CASE WHEN rating = 1 THEN 1 END)::int AS stars_1
      FROM reviews
      WHERE is_approved = TRUE
    `;
    const statsResult = await db.query(statsQuery);
    const stats = statsResult.rows[0] || {
      total_count: 0,
      average_rating: 5.0,
      stars_5: 0,
      stars_4: 0,
      stars_3: 0,
      stars_2: 0,
      stars_1: 0,
    };

    return res.status(200).json({
      reviews: result.rows,
      stats: {
        totalReviews: stats.total_count,
        averageRating: stats.average_rating,
        breakdown: {
          5: stats.stars_5,
          4: stats.stars_4,
          3: stats.stars_3,
          2: stats.stars_2,
          1: stats.stars_1,
        },
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(stats.total_count / limitNum),
      },
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

/**
 * POST /api/reviews
 * Open submission for any user (logged-in or guest)
 * Supports optional photo upload via Multer/Cloudinary
 */
const createReview = async (req, res) => {
  try {
    const { name, email, location, rating, category, title, comment } = req.body;

    // Validate rating
    const parsedRating = parseInt(rating, 10);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'Rating must be a whole number between 1 and 5 stars.' });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'Please write a brief description or feedback.' });
    }

    // Optional user token decoding
    let userId = null;
    let authUser = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      try {
        authUser = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        userId = authUser?.id || null;
      } catch (e) {
        // Continue as guest if token expired
      }
    }

    // Determine user name and email
    const finalName = stripHtml(authUser?.name || name || 'Honey Lover').slice(0, 100);
    const finalEmail = String(authUser?.email || email || '').trim().toLowerCase().slice(0, 150);
    const finalLocation = stripHtml(location || 'India').slice(0, 100);
    const finalCategory = stripHtml(category || 'quality').slice(0, 50);
    const finalTitle = stripHtml(title || '').slice(0, 200);
    const finalComment = stripHtml(comment).slice(0, 2500);

    // Verify buyer status: Check if email or userId has completed orders
    let isVerifiedBuyer = false;
    let badgeType = 'guest';

    if (userId || finalEmail) {
      const orderCheckQuery = `
        SELECT id FROM orders 
        WHERE (user_id = $1 OR LOWER(email) = LOWER($2))
          AND status IN ('Completed', 'Delivered', 'Verified', 'completed', 'delivered')
        LIMIT 1
      `;
      const orderCheck = await db.query(orderCheckQuery, [userId || '', finalEmail || '']);
      if (orderCheck.rows.length > 0) {
        isVerifiedBuyer = true;
        badgeType = 'verified_buyer';
      } else if (userId) {
        badgeType = 'community_member';
      }
    }

    // Handle uploaded image via Cloudinary to save PostgreSQL database storage
    let imageUrl = null;
    let imagePublicId = null;
    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url || null;
      imagePublicId = req.file.filename || req.file.public_id || null;

      // Ensure that if file came from local disk or memory buffer, it gets pushed to Cloudinary
      if (imageUrl && !imageUrl.startsWith('http')) {
        try {
          const uploadRes = await cloudinary.uploader.upload(imageUrl, {
            folder: 'aai-ji-honey/reviews',
            resource_type: 'image',
          });
          imageUrl = uploadRes.secure_url;
          imagePublicId = uploadRes.public_id;
        } catch (cErr) {
          console.warn('⚠️ Cloudinary manual upload fallback warning:', cErr.message);
        }
      }
    } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('data:image/')) {
      // Base64 upload to Cloudinary: NEVER store raw base64 data blobs in PostgreSQL
      try {
        const uploadRes = await cloudinary.uploader.upload(req.body.image, {
          folder: 'aai-ji-honey/reviews',
          resource_type: 'image',
        });
        imageUrl = uploadRes.secure_url;
        imagePublicId = uploadRes.public_id;
      } catch (cErr) {
        console.warn('⚠️ Cloudinary base64 upload error:', cErr.message);
      }
    }

    const reviewId = 'rev_' + crypto.randomBytes(10).toString('hex');

    const insertQuery = `
      INSERT INTO reviews (
        id,
        user_id,
        user_name,
        user_email,
        location,
        rating,
        category,
        title,
        comment,
        image_url,
        image_public_id,
        badge_type,
        is_verified_buyer,
        is_approved
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, TRUE)
      RETURNING *
    `;

    const result = await db.query(insertQuery, [
      reviewId,
      userId,
      finalName,
      finalEmail,
      finalLocation,
      parsedRating,
      finalCategory,
      finalTitle,
      finalComment,
      imageUrl,
      imagePublicId,
      badgeType,
      isVerifiedBuyer,
    ]);

    const created = result.rows[0];

    // Notify admin asynchronously about new customer review
    notifyAdminNewReview({ review: created }).catch((e) =>
      console.warn('Admin review alert warning:', e.message)
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published to our community.',
      review: {
        id: created.id,
        user_name: created.user_name,
        location: created.location,
        rating: created.rating,
        category: created.category,
        title: created.title,
        comment: created.comment,
        image_url: created.image_url,
        badge_type: created.badge_type,
        is_verified_buyer: created.is_verified_buyer,
        created_at: created.created_at,
      },
    });
  } catch (err) {
    console.error('Error creating review:', err);
    return res.status(500).json({ error: 'Failed to submit your review. Please try again.' });
  }
};

/**
 * GET /api/reviews/admin
 * Admin endpoint to view all reviews including unapproved/flagged
 */
const getAdminReviews = async (req, res) => {
  try {
    const query = `
      SELECT * FROM reviews 
      ORDER BY created_at DESC 
      LIMIT 200
    `;
    const result = await db.query(query);
    return res.status(200).json({ reviews: result.rows });
  } catch (err) {
    console.error('Error fetching admin reviews:', err);
    return res.status(500).json({ error: 'Failed to fetch reviews for admin' });
  }
};

/**
 * DELETE /api/reviews/:id
 * Admin endpoint to delete inappropriate/spam reviews
 */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch review to check if image needs cleanup
    const checkResult = await db.query('SELECT image_public_id FROM reviews WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const publicId = checkResult.rows[0]?.image_public_id;
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cErr) {
        console.warn('Could not delete review image from Cloudinary:', cErr.message);
      }
    }

    await db.query('DELETE FROM reviews WHERE id = $1', [id]);

    return res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    return res.status(500).json({ error: 'Failed to delete review' });
  }
};

/**
 * PATCH /api/reviews/:id/toggle-approval
 * Admin endpoint to approve or hide review
 */
const toggleReviewApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `UPDATE reviews 
       SET is_approved = NOT is_approved, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Review is now ${result.rows[0].is_approved ? 'Visible' : 'Hidden'}`,
      review: result.rows[0],
    });
  } catch (err) {
    console.error('Error toggling review approval:', err);
    return res.status(500).json({ error: 'Failed to update review status' });
  }
};

module.exports = {
  getReviews,
  createReview,
  getAdminReviews,
  deleteReview,
  toggleReviewApproval,
};

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendMessageReplyEmail } = require('../services/emailService');

/**
 * Submit a new message or inquiry from Contact Page, Apiary Section, or User Profile
 * POST /api/messages
 */
const createMessage = async (req, res) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    // Anti-bot honeypot check for inquiries
    if (req.body.website_url || req.body.bot_trap || req.body.honeypot) {
      console.warn('🤖 Anti-bot honeypot triggered on message submission.');
      return res.status(200).json({
        success: true,
        message: 'Your inquiry has been sent to our Apiary Team! We will respond shortly.',
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // Strip any HTML tags to prevent stored XSS attacks
    const stripHtml = (str) => (str ? String(str).replace(/<[^>]*>?/gm, '').trim() : '');

    const cleanName = stripHtml(name).slice(0, 100);
    const cleanEmail = String(email).trim().toLowerCase().slice(0, 150);
    const cleanMobile = mobile ? stripHtml(mobile).slice(0, 20) : null;
    const cleanSubject = stripHtml(subject || 'General Inquiry').slice(0, 150);
    const cleanMessage = stripHtml(message).slice(0, 2000);

    // Check if customer is authenticated
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        if (decoded && decoded.id && decoded.role !== 'admin') {
          userId = decoded.id;
        }
      } catch (e) {}
    }

    // If userId not found from token, check if user exists in database by email
    if (!userId) {
      const userRes = await db.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
      if (userRes.rows.length > 0) {
        userId = userRes.rows[0].id;
      }
    }

    const id = crypto.randomBytes(12).toString('hex');

    const insertQuery = `
      INSERT INTO messages (id, user_id, name, email, mobile, subject, message, status, is_read_by_admin, is_read_by_user)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'unread', FALSE, TRUE)
      RETURNING *;
    `;

    const values = [id, userId, cleanName, cleanEmail, cleanMobile, cleanSubject, cleanMessage];
    const result = await db.query(insertQuery, values);

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been sent to our Apiary Team! We will respond shortly.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating message:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
};

/**
 * Get all messages for Store Admin Dashboard
 * GET /api/messages
 */
const getAllMessages = async (req, res) => {
  try {
    const { status } = req.query;

    let queryText = 'SELECT * FROM messages';
    const params = [];

    if (status === 'unread') {
      queryText += ' WHERE is_read_by_admin = FALSE';
    } else if (status === 'replied') {
      queryText += " WHERE status = 'replied'";
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await db.query(queryText, params);

    // Count unread messages for admin badge
    const countRes = await db.query('SELECT COUNT(*) FROM messages WHERE is_read_by_admin = FALSE');
    const unreadCount = parseInt(countRes.rows[0].count, 10) || 0;

    res.json({
      messages: result.rows,
      unreadCount,
    });
  } catch (err) {
    console.error('Error fetching messages for admin:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

/**
 * Store Admin replies to customer message
 * Saves reply in NeonDB and emails customer
 * POST /api/messages/:id/reply
 */
const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ error: 'Reply text cannot be empty' });
    }

    const cleanReply = String(reply).trim();

    const updateQuery = `
      UPDATE messages
      SET admin_reply = $1,
          status = 'replied',
          is_read_by_admin = TRUE,
          is_read_by_user = FALSE,
          replied_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;

    const result = await db.query(updateQuery, [cleanReply, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const updated = result.rows[0];

    // Asynchronously dispatch reply email to customer
    sendMessageReplyEmail({
      toEmail: updated.email,
      customerName: updated.name,
      subject: updated.subject,
      originalMessage: updated.message,
      replyMessage: cleanReply,
    }).catch((emailErr) => {
      console.error('Warning: Reply email dispatch error:', emailErr.message);
    });

    res.json({
      success: true,
      message: 'Reply saved and emailed to customer successfully.',
      updatedMessage: updated,
    });
  } catch (err) {
    console.error('Error replying to message:', err);
    res.status(500).json({ error: 'Failed to save reply' });
  }
};

/**
 * Get messages sent by currently logged-in user
 * GET /api/messages/my-messages
 */
const getMyMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const result = await db.query(
      `SELECT * FROM messages
       WHERE user_id = $1 OR LOWER(email) = LOWER($2)
       ORDER BY created_at DESC`,
      [userId, userEmail]
    );

    // Count unread replies for customer badge
    const countRes = await db.query(
      `SELECT COUNT(*) FROM messages
       WHERE (user_id = $1 OR LOWER(email) = LOWER($2))
         AND is_read_by_user = FALSE
         AND admin_reply IS NOT NULL`,
      [userId, userEmail]
    );
    const unreadCount = parseInt(countRes.rows[0].count, 10) || 0;

    res.json({
      messages: result.rows,
      unreadCount,
    });
  } catch (err) {
    console.error('Error fetching user messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

/**
 * Mark a message as read (either by admin or by user)
 * PATCH /api/messages/:id/read
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user?.role;
    const { target } = req.body || {};

    if (target === 'admin' || (role === 'admin' || role === 'owner')) {
      if (role !== 'admin' && role !== 'owner') {
        return res.status(403).json({ error: 'Administrator role required to mark admin messages as read' });
      }
      await db.query(
        `UPDATE messages 
         SET is_read_by_admin = TRUE, 
             status = CASE WHEN status = 'unread' THEN 'read' ELSE status END 
         WHERE id = $1`,
        [id]
      );
    } else {
      // Scoped strictly to current customer's ID or email (prevents IDOR)
      await db.query(
        `UPDATE messages 
         SET is_read_by_user = TRUE 
         WHERE id = $1 AND (user_id = $2 OR LOWER(email) = LOWER($3))`,
        [id, req.user?.id || '', req.user?.email || '']
      );
    }

    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    console.error('Error marking message as read:', err);
    res.status(500).json({ error: 'Failed to update read status' });
  }
};

/**
 * Mark all messages as read (either for admin or for current user)
 * PATCH /api/messages/read-all
 */
const markAllAsRead = async (req, res) => {
  try {
    const role = req.user?.role;
    const { target } = req.body || {};

    if (target === 'admin' || (target !== 'user' && (role === 'admin' || role === 'owner'))) {
      if (role !== 'admin' && role !== 'owner') {
        return res.status(403).json({ error: 'Administrator role required to mark all admin messages as read' });
      }
      await db.query(
        `UPDATE messages 
         SET is_read_by_admin = TRUE, 
             status = CASE WHEN status = 'unread' THEN 'read' ELSE status END 
         WHERE is_read_by_admin = FALSE`
      );
    } else {
      await db.query(
        `UPDATE messages 
         SET is_read_by_user = TRUE 
         WHERE (user_id = $1 OR LOWER(email) = LOWER($2)) AND is_read_by_user = FALSE`,
        [req.user?.id || '', req.user?.email || '']
      );
    }

    res.json({ success: true, message: 'All messages marked as read' });
  } catch (err) {
    console.error('Error marking all messages as read:', err);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};

/**
 * Get unread notification counts for Navbar badge
 * GET /api/messages/unread-count
 */
const getUnreadCounts = async (req, res) => {
  try {
    let adminUnread = 0;
    let userUnread = 0;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

        if (decoded.role === 'admin' || decoded.role === 'owner') {
          const adminCountRes = await db.query(
            'SELECT COUNT(*) FROM messages WHERE is_read_by_admin = FALSE'
          );
          adminUnread = parseInt(adminCountRes.rows[0].count, 10) || 0;
        } else {
          const userCountRes = await db.query(
            `SELECT COUNT(*) FROM messages
             WHERE (user_id = $1 OR LOWER(email) = LOWER($2))
               AND is_read_by_user = FALSE
               AND admin_reply IS NOT NULL`,
            [decoded.id, decoded.email]
          );
          userUnread = parseInt(userCountRes.rows[0].count, 10) || 0;
        }
      } catch (e) {}
    }

    res.json({ adminUnread, userUnread });
  } catch (err) {
    res.json({ adminUnread: 0, userUnread: 0 });
  }
};

/**
 * Delete a customer message / inquiry
 * DELETE /messages/:id (Protected, Admin)
 */
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM messages WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted successfully', id });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ error: 'Failed to delete inquiry message' });
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  replyToMessage,
  getMyMessages,
  markAsRead,
  markAllAsRead,
  getUnreadCounts,
  deleteMessage,
};

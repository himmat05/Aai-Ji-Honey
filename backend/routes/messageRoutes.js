const express = require('express');
const router = express.Router();
const {
  createMessage,
  getAllMessages,
  replyToMessage,
  getMyMessages,
  markAsRead,
  getUnreadCounts,
} = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

// Public / Authenticated message submission
router.post('/', createMessage);
router.post('/send', createMessage);

// Live Unread Notification counts (for Navbar badges)
router.get('/unread-count', getUnreadCounts);

// Customer message history
router.get('/my-messages', authenticateToken, getMyMessages);

// Store Admin message management
router.get('/', authenticateToken, requireAdmin, getAllMessages);
router.post('/:id/reply', authenticateToken, requireAdmin, replyToMessage);

// Mark message as read
router.patch('/:id/read', authenticateToken, markAsRead);

module.exports = router;

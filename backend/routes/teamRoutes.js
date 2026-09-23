const express = require('express');
const router = express.Router();
const {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllTeamMembers);
router.post('/', authenticateToken, requireAdmin, upload.single('image'), createTeamMember);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), updateTeamMember);
router.delete('/:id', authenticateToken, requireAdmin, deleteTeamMember);

module.exports = router;

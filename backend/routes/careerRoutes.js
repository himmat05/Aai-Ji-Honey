const express = require('express');
const router = express.Router();
const careerUpload = require('../middleware/careerUploadMiddleware');
const { careerLimiter } = require('../middleware/rateLimiter');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const {
  getActiveJobOpenings,
  applyForJob,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
  getAdminJobs,
  createJobOpening,
  toggleJobStatus,
  deleteJobOpening,
  getResumeFile,
} = require('../controllers/careerController');

// ==========================================
// Public Candidate Endpoints
// ==========================================

// Get active job openings
router.get('/jobs', getActiveJobOpenings);

// Submit job application with resume file (Rate limited: 10/hr)
router.post('/apply', careerLimiter, (req, res, next) => {
  careerUpload.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, applyForJob);

// ==========================================
// Protected Admin Endpoints
// ==========================================

// Stream / view candidate resume (Supports browser iframe & new tab via ?token= or Bearer header)
router.get('/applications/:id/resume', getResumeFile);

// Application management
router.get('/applications', authenticateToken, requireAdmin, getAllApplications);
router.patch('/applications/:id/status', authenticateToken, requireAdmin, updateApplicationStatus);
router.delete('/applications/:id', authenticateToken, requireAdmin, deleteApplication);

// Job opening management
router.get('/admin/jobs', authenticateToken, requireAdmin, getAdminJobs);
router.post('/admin/jobs', authenticateToken, requireAdmin, createJobOpening);
router.patch('/admin/jobs/:id/toggle', authenticateToken, requireAdmin, toggleJobStatus);
router.delete('/admin/jobs/:id', authenticateToken, requireAdmin, deleteJobOpening);

module.exports = router;

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const db = require('../config/db');
const { cloudinary } = require('../config/cloudinary');
const { sendCareerApplicationEmail } = require('../services/emailService');

// Strip HTML tags to prevent stored XSS attacks
const stripHtml = (str) => (str ? String(str).replace(/<[^>]*>?/gm, '').trim() : '');

/**
 * Public: Get all active job openings for website visitors
 * GET /api/careers/jobs
 */
const getActiveJobOpenings = async (req, res) => {
  try {
    const query = `
      SELECT 
        id AS "_id",
        title,
        department,
        location,
        employment_type AS "employmentType",
        experience_required AS "experienceRequired",
        salary_range AS "salaryRange",
        description,
        requirements,
        order_num AS "orderNum",
        is_active AS "isActive",
        created_at AS "createdAt"
      FROM job_openings
      WHERE is_active = TRUE
      ORDER BY order_num ASC, created_at DESC
    `;
    const result = await db.query(query);
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching job openings:', err);
    return res.status(500).json({ error: 'Failed to fetch job openings' });
  }
};

/**
 * Public: Submit a job application with resume file
 * POST /api/careers/apply
 */
const applyForJob = async (req, res) => {
  try {
    const {
      jobId,
      jobTitle,
      name,
      email,
      mobile,
      city,
      experience,
      linkedinUrl,
      coverNote,
    } = req.body;

    // Anti-bot honeypot protection: silently drop automated spam bots
    if (req.body.website_url || req.body.bot_trap || req.body.company_fax) {
      console.warn('🤖 Anti-bot honeypot triggered on career application.');
      return res.status(200).json({
        success: true,
        message: 'Your application has been received by our Apiculture Recruitment Team.',
        trackingId: 'AJH-APP-VERIFIED',
      });
    }

    if (!name || !email || !mobile || !jobTitle) {
      return res.status(400).json({
        error: 'Please fill in all required fields: Full Name, Email, Mobile Number, and Position.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'Please attach your Resume / CV file (PDF or DOCX format, max 5MB).',
      });
    }

    const cleanName = stripHtml(name).slice(0, 100);
    const cleanEmail = String(email).trim().toLowerCase().slice(0, 150);
    const rawMobile = stripHtml(mobile || '');
    const cleanMobile = rawMobile.replace(/\D/g, '').slice(-10);

    if (cleanMobile.length !== 10) {
      return res.status(400).json({
        error: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).',
      });
    }

    const cleanJobTitle = stripHtml(jobTitle).slice(0, 150);
    const cleanCity = city ? stripHtml(city).slice(0, 100) : 'Rajasthan, India';
    const cleanExperience = experience ? stripHtml(experience).slice(0, 50) : 'Not specified';
    const cleanLinkedin = linkedinUrl ? stripHtml(linkedinUrl).slice(0, 250) : null;
    const cleanCoverNote = coverNote ? stripHtml(coverNote).slice(0, 2000) : '';

    // Handle resume file: read binary buffer for permanent DB persistence (bypasses Cloudinary 401 PDF restrictions)
    const localFilename = path.basename(req.file.path);
    const fileMimeType = req.file.mimetype || 'application/pdf';
    let resumeBase64 = null;
    try {
      if (fs.existsSync(req.file.path)) {
        const fileBuf = fs.readFileSync(req.file.path);
        resumeBase64 = fileBuf.toString('base64');
      }
    } catch (readErr) {
      console.warn('Could not read resume buffer for DB backup:', readErr.message);
    }

    let resumeUrl = `/uploads/resumes/${localFilename}`;
    let resumePublicId = null;

    try {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        const cloudUpload = await cloudinary.uploader.upload(req.file.path, {
          folder: 'aai-ji-honey/resumes',
          resource_type: 'raw',
          tags: ['resume', 'career_application'],
        });
        if (cloudUpload && cloudUpload.secure_url) {
          resumeUrl = cloudUpload.secure_url;
          resumePublicId = cloudUpload.public_id;
        }
      }
    } catch (cloudErr) {
      console.warn('⚠️ Cloudinary raw upload info:', cloudErr.message);
    }

    const id = `AJH-APP-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    const insertQuery = `
      INSERT INTO job_applications (
        id, job_id, job_title, name, email, mobile, city, experience,
        linkedin_url, cover_note, resume_url, resume_public_id,
        resume_data, resume_mimetype, resume_filename,
        status, is_read_by_admin
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'new', FALSE)
      RETURNING *;
    `;

    const values = [
      id,
      jobId || null,
      cleanJobTitle,
      cleanName,
      cleanEmail,
      cleanMobile,
      cleanCity,
      cleanExperience,
      cleanLinkedin,
      cleanCoverNote,
      resumeUrl,
      resumePublicId,
      resumeBase64,
      fileMimeType,
      localFilename,
    ];

    const result = await db.query(insertQuery, values);

    // Send asynchronous confirmation email (won't block HTTP response)
    sendCareerApplicationEmail({
      toEmail: cleanEmail,
      applicantName: cleanName,
      jobTitle: cleanJobTitle,
      trackingId: id,
    }).catch((e) => console.warn('Email dispatch warning:', e.message));

    return res.status(201).json({
      success: true,
      message: 'Your application has been received by Dr. Neha Tomar & our Apiculture Recruitment Team!',
      trackingId: id,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error submitting job application:', err);
    return res.status(500).json({ error: 'Failed to submit application. Please try again later.' });
  }
};

/**
 * Admin: Get all job applications with filtering & search
 * GET /api/careers/applications
 */
const getAllApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT 
        id AS "_id",
        job_id AS "jobId",
        job_title AS "jobTitle",
        name,
        email,
        mobile,
        city,
        experience,
        linkedin_url AS "linkedinUrl",
        cover_note AS "coverNote",
        resume_url AS "resumeUrl",
        status,
        admin_notes AS "adminNotes",
        is_read_by_admin AS "isReadByAdmin",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM job_applications
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      const pIdx = params.length;
      query += ` AND (
        LOWER(name) LIKE $${pIdx} OR 
        LOWER(email) LIKE $${pIdx} OR 
        LOWER(mobile) LIKE $${pIdx} OR 
        LOWER(job_title) LIKE $${pIdx} OR 
        LOWER(city) LIKE $${pIdx}
      )`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await db.query(query, params);

    // Count unreviewed/new applications
    const unreadCountRes = await db.query(
      `SELECT COUNT(*)::int AS count FROM job_applications WHERE is_read_by_admin = FALSE OR status = 'new'`
    );
    const unreadCount = unreadCountRes.rows[0]?.count || 0;

    return res.status(200).json({
      applications: result.rows,
      unreadCount,
      totalCount: result.rows.length,
    });
  } catch (err) {
    console.error('Error fetching applications:', err);
    return res.status(500).json({ error: 'Failed to fetch job applications' });
  }
};

/**
 * Admin: Update application status or add interview notes
 * PATCH /api/careers/applications/:id/status
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const allowedStatuses = ['new', 'shortlisted', 'interviewing', 'rejected', 'hired'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid application status value' });
    }

    const query = `
      UPDATE job_applications
      SET 
        status = COALESCE($1, status),
        admin_notes = COALESCE($2, admin_notes),
        is_read_by_admin = TRUE,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;

    const result = await db.query(query, [status || null, adminNotes !== undefined ? adminNotes : null, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job application not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      application: result.rows[0],
    });
  } catch (err) {
    console.error('Error updating application status:', err);
    return res.status(500).json({ error: 'Failed to update application' });
  }
};

/**
 * Admin: Delete application permanently
 * DELETE /api/careers/applications/:id
 */
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const findRes = await db.query('SELECT resume_public_id, resume_url FROM job_applications WHERE id = $1', [id]);
    if (findRes.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const appRecord = findRes.rows[0];

    // Delete from Cloudinary if public_id exists
    if (appRecord.resume_public_id) {
      try {
        await cloudinary.uploader.destroy(appRecord.resume_public_id, { resource_type: 'raw' });
      } catch (e) {
        console.warn('Could not delete Cloudinary raw file:', e.message);
      }
    }

    await db.query('DELETE FROM job_applications WHERE id = $1', [id]);
    return res.status(200).json({ success: true, message: 'Application deleted successfully' });
  } catch (err) {
    console.error('Error deleting application:', err);
    return res.status(500).json({ error: 'Failed to delete application' });
  }
};

/**
 * Admin: Get all jobs (active and inactive)
 * GET /api/careers/admin/jobs
 */
const getAdminJobs = async (req, res) => {
  try {
    const query = `
      SELECT 
        id AS "_id",
        title,
        department,
        location,
        employment_type AS "employmentType",
        experience_required AS "experienceRequired",
        salary_range AS "salaryRange",
        description,
        requirements,
        order_num AS "orderNum",
        is_active AS "isActive",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM job_openings
      ORDER BY order_num ASC, created_at DESC
    `;
    const result = await db.query(query);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching admin jobs:', err);
    return res.status(500).json({ error: 'Failed to fetch job openings' });
  }
};

/**
 * Admin: Create a new job opening
 * POST /api/careers/admin/jobs
 */
const createJobOpening = async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      employmentType,
      experienceRequired,
      salaryRange,
      description,
      requirements,
      orderNum,
    } = req.body;

    if (!title || !department || !description) {
      return res.status(400).json({ error: 'Title, Department, and Description are required.' });
    }

    const id = crypto.randomBytes(12).toString('hex');
    const query = `
      INSERT INTO job_openings (
        id, title, department, location, employment_type, experience_required,
        salary_range, description, requirements, order_num, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)
      RETURNING *;
    `;

    const values = [
      id,
      stripHtml(title),
      stripHtml(department),
      stripHtml(location || 'Rajasthan, India'),
      stripHtml(employmentType || 'Full-Time'),
      stripHtml(experienceRequired || '1-2 Years'),
      stripHtml(salaryRange || 'Competitive'),
      stripHtml(description),
      requirements ? stripHtml(requirements) : '',
      parseInt(orderNum, 10) || 0,
    ];

    const result = await db.query(query, values);
    return res.status(201).json({
      success: true,
      message: 'Job opening published successfully!',
      job: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating job opening:', err);
    return res.status(500).json({ error: 'Failed to create job opening' });
  }
};

/**
 * Admin: Toggle active status of a job opening
 * PATCH /api/careers/admin/jobs/:id/toggle
 */
const toggleJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      UPDATE job_openings
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job opening not found' });
    }
    return res.status(200).json({
      success: true,
      message: `Job opening ${result.rows[0].is_active ? 'activated' : 'deactivated'} successfully`,
      job: result.rows[0],
    });
  } catch (err) {
    console.error('Error toggling job status:', err);
    return res.status(500).json({ error: 'Failed to update job status' });
  }
};

/**
 * Admin: Delete a job opening
 * DELETE /api/careers/admin/jobs/:id
 */
const deleteJobOpening = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM job_openings WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job opening not found' });
    }
    return res.status(200).json({ success: true, message: 'Job opening deleted successfully' });
  } catch (err) {
    console.error('Error deleting job opening:', err);
    return res.status(500).json({ error: 'Failed to delete job opening' });
  }
};

/**
 * Admin: Get and stream / view candidate resume file directly
 * Supports inline browser PDF preview, local files, and Cloudinary stream
 * GET /api/careers/applications/:id/resume
 */
const getResumeFile = async (req, res) => {
  try {
    const { id } = req.params;

    // Check token from Authorization Bearer header OR ?token= query parameter
    const authHeader = req.headers.authorization;
    const headerToken =
      authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = req.query.token || headerToken;

    if (!token) {
      return res.status(401).send('Authentication token required to view candidate resumes.');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      const isPrivileged =
        decoded.role === 'admin' ||
        decoded.role === 'owner' ||
        decoded.isAdmin ||
        decoded.isOwner;

      if (!isPrivileged) {
        return res
          .status(403)
          .send('Forbidden: Only administrators can view candidate resumes.');
      }
    } catch (e) {
      return res
        .status(403)
        .send('Invalid or expired authentication token. Please re-login to the admin dashboard.');
    }

    const findRes = await db.query(
      `SELECT id, name, job_title, resume_url, resume_public_id, resume_data, resume_mimetype, resume_filename
       FROM job_applications WHERE id = $1`,
      [id]
    );

    if (findRes.rows.length === 0) {
      return res.status(404).send('Job application not found.');
    }

    const application = findRes.rows[0];
    const safeCandidateName = (application.name || 'Candidate')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 30);
    const downloadFilename = `Resume_${safeCandidateName}_${application.id}`;

    // Priority 1: Direct database base64 binary stream (100% permanent, never fails, zero 401s)
    if (application.resume_data) {
      const fileBuffer = Buffer.from(application.resume_data, 'base64');
      const ext = application.resume_filename
        ? path.extname(application.resume_filename).toLowerCase()
        : '.pdf';
      const mimeType =
        application.resume_mimetype ||
        (ext === '.pdf' ? 'application/pdf' : 'application/octet-stream');

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${downloadFilename}${ext}"`);
      res.setHeader('Content-Length', fileBuffer.length);
      return res.end(fileBuffer);
    }

    // Priority 2: Check local disk storage in uploads/resumes/
    const resumesDir = path.join(__dirname, '..', 'uploads', 'resumes');
    let localFileFound = null;

    if (application.resume_filename) {
      const candidatePath = path.join(resumesDir, application.resume_filename);
      if (fs.existsSync(candidatePath)) localFileFound = candidatePath;
    }

    if (!localFileFound && application.resume_url) {
      const parsedName = path.basename(application.resume_url.split('?')[0]);
      const candidatePath = path.join(resumesDir, parsedName);
      if (fs.existsSync(candidatePath)) localFileFound = candidatePath;
    }

    // Smart fallback: search uploads/resumes for any file matching candidate name or recent upload
    if (!localFileFound && fs.existsSync(resumesDir)) {
      const files = fs.readdirSync(resumesDir);
      const nameParts = safeCandidateName.toLowerCase().split('_').filter((p) => p.length > 2);
      const match = files.find((f) => {
        const lower = f.toLowerCase();
        return nameParts.some((part) => lower.includes(part));
      });
      if (match) {
        localFileFound = path.join(resumesDir, match);
      } else if (files.length > 0) {
        localFileFound = path.join(resumesDir, files[files.length - 1]);
      }
    }

    if (localFileFound && fs.existsSync(localFileFound)) {
      const ext = path.extname(localFileFound).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.docx')
        contentType =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (ext === '.doc') contentType = 'application/msword';

      // Save into DB for future instant hits
      try {
        const buf = fs.readFileSync(localFileFound);
        db.query(
          `UPDATE job_applications SET resume_data = $1, resume_filename = $2, resume_mimetype = $3 WHERE id = $4`,
          [buf.toString('base64'), path.basename(localFileFound), contentType, id]
        ).catch(() => {});
      } catch (e) {}

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${downloadFilename}${ext}"`);
      return res.sendFile(path.resolve(localFileFound));
    }

    // Priority 3: Remote Cloudinary streaming fallback
    if (application.resume_url && application.resume_url.startsWith('http')) {
      try {
        const cloudStream = await axios({
          method: 'GET',
          url: application.resume_url,
          responseType: 'stream',
          timeout: 12000,
        });

        const contentType =
          cloudStream.headers['content-type'] ||
          (application.resume_url.toLowerCase().includes('.pdf')
            ? 'application/pdf'
            : 'application/octet-stream');
        const ext = path.extname(application.resume_url.split('?')[0]) || '.pdf';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${downloadFilename}${ext}"`);
        return cloudStream.data.pipe(res);
      } catch (streamErr) {
        console.warn('⚠️ Cloudinary stream failed:', streamErr.message);
      }
    }

    return res.status(404).send('Resume file could not be located on server storage.');
  } catch (err) {
    console.error('Error delivering resume file:', err);
    return res.status(500).send('Internal server error loading resume file.');
  }
};

module.exports = {
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
};

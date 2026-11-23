const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/resumes directory exists
const resumesDir = path.join(__dirname, '..', 'uploads', 'resumes');
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

// Allowed MIME types and extensions for resumes
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/octet-stream', // Some browsers send this for docx/pdf
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc'];

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 40);
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `resume_${sanitizedBase}_${uniqueSuffix}${ext}`);
  },
});

const careerUpload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(
        new Error('Invalid file format. Only PDF, DOCX, and DOC resumes up to 5MB are accepted.'),
        false
      );
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new Error('Invalid file MIME type. Only genuine PDF and Word documents are permitted.'),
        false
      );
    }
    cb(null, true);
  },
});

module.exports = careerUpload;

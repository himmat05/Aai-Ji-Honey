const multer = require('multer');
const { storage } = require('../config/cloudinary');

/**
 * Multer upload middleware backed by Cloudinary storage
 */
const upload = multer({ storage });

module.exports = upload;

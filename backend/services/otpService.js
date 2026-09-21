const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../config/db');

/**
 * Configure Nodemailer transporter using Gmail credentials from .env
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Generate a 6-digit cryptographic numeric OTP
 */
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Save OTP to database with 10-minute expiration
 * @param {string} email 
 * @param {string} otp 
 * @param {string} purpose - 'signup' | 'forgot_password'
 */
const saveOtp = async (email, otp, purpose) => {
  const normalizedEmail = email.toLowerCase().trim();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Remove any existing active OTPs for this email and purpose
  await db.query(
    'DELETE FROM otps WHERE LOWER(email) = LOWER($1) AND purpose = $2',
    [normalizedEmail, purpose]
  );

  // Insert new OTP
  await db.query(
    'INSERT INTO otps (email, otp, purpose, expires_at) VALUES ($1, $2, $3, $4)',
    [normalizedEmail, otp, purpose, expiresAt]
  );
};

/**
 * Send OTP email with Aai Ji Honey branded template
 * @param {string} email 
 * @param {string} otp 
 * @param {string} purpose - 'signup' | 'forgot_password'
 */
const sendOtpEmail = async (email, otp, purpose) => {
  const isSignup = purpose === 'signup';
  const subject = isSignup
    ? '🍯 Verify Your Email - Aai Ji Honey Signup'
    : '🔐 Password Reset OTP - Aai Ji Honey';

  const title = isSignup ? 'Welcome to Aai Ji Honey!' : 'Password Reset Request';
  const message = isSignup
    ? 'Thank you for choosing Aai Ji Honey. Please use the verification code below to complete your account registration:'
    : 'We received a request to reset your password. Use the verification code below to set a new password:';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fffbeb; margin: 0; padding: 20px; color: #451a03; }
        .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(245, 158, 11, 0.15); border: 2px solid #fef3c7; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px; }
        .header p { margin: 6px 0 0; font-size: 14px; opacity: 0.95; }
        .content { padding: 35px 30px; text-align: center; }
        .content p { font-size: 15px; line-height: 1.6; color: #78350f; margin-bottom: 25px; }
        .otp-box { display: inline-block; background: #fffbeb; border: 2px dashed #f59e0b; border-radius: 14px; padding: 16px 36px; margin: 10px 0 25px; letter-spacing: 8px; font-size: 34px; font-weight: 800; color: #b45309; }
        .notice { font-size: 13px; color: #92400e; background-color: #fef3c7; border-radius: 10px; padding: 12px; margin-top: 15px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #b45309; border-top: 1px solid #fef3c7; background: #fffdf5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍯 Aai Ji Honey</h1>
          <p>100% Pure, Raw & Natural Rajasthan Honey</p>
        </div>
        <div class="content">
          <h2 style="color: #92400e; margin-top: 0;">${title}</h2>
          <p>${message}</p>
          <div class="otp-box">${otp}</div>
          <div class="notice">
            ⏰ <strong>This OTP is valid for 10 minutes.</strong><br/>
            Never share your OTP with anyone. Our team will never ask for your code.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Aai Ji Honey. All rights reserved.<br/>
          Need assistance? Contact our support team directly.
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Aai Ji Honey" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject,
    html,
  });

  console.log(`📧 OTP email sent to ${email} for purpose: ${purpose}`);
};

/**
 * Verify OTP against database
 * @param {string} email 
 * @param {string} otp 
 * @param {string} purpose 
 * @returns {Promise<boolean>}
 */
const verifyOtp = async (email, otp, purpose) => {
  const normalizedEmail = email.toLowerCase().trim();
  const trimmedOtp = otp ? otp.toString().trim() : '';

  const result = await db.query(
    `SELECT id FROM otps 
     WHERE LOWER(email) = LOWER($1) 
       AND otp = $2 
       AND purpose = $3 
       AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [normalizedEmail, trimmedOtp, purpose]
  );

  if (result.rows.length === 0) {
    return false;
  }

  // Delete used OTP
  await db.query('DELETE FROM otps WHERE id = $1', [result.rows[0].id]);
  return true;
};

module.exports = {
  generateOtp,
  saveOtp,
  sendOtpEmail,
  verifyOtp,
};

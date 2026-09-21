const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const { generateOtp, saveOtp, sendOtpEmail, verifyOtp } = require('../services/otpService');
const { verifyGoogleToken, exchangeGoogleCode } = require('../services/googleAuthService');
const { validateStrongPassword } = require('../utils/validators');

/**
 * Step 1: Send Signup Verification OTP
 * POST /api/auth/send-signup-otp
 */
const sendSignupOtp = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  const pwdError = validateStrongPassword(password);
  if (pwdError) {
    return res.status(400).json({ message: pwdError });
  }

  if (mobile) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(mobile.trim())) {
      return res.status(400).json({ message: 'Mobile number must be a valid 10-digit number.' });
    }
  }

  try {
    // Check if verified account already exists
    const existingUser = await db.query(
      'SELECT id, is_verified FROM users WHERE LOWER(email) = LOWER($1)',
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0 && existingUser.rows[0].is_verified) {
      return res.status(400).json({
        message: 'An account with this email already exists. Please sign in instead.',
      });
    }

    // Generate & send OTP
    const otp = generateOtp();
    await saveOtp(normalizedEmail, otp, 'signup');
    await sendOtpEmail(normalizedEmail, otp, 'signup');

    res.status(200).json({
      message: 'Verification OTP sent to your email. Please check your inbox.',
    });
  } catch (error) {
    console.error('Error sending signup OTP:', error);
    res.status(500).json({
      message: 'Failed to send verification OTP. Please verify your email or try again later.',
    });
  }
};

/**
 * Step 2: Verify OTP & Complete Signup
 * POST /api/auth/verify-signup-otp
 */
const verifySignupOtp = async (req, res) => {
  const { name, email, mobile, password, otp, address, location } = req.body;

  if (!name || !email || !password || !otp) {
    return res.status(400).json({ message: 'All details including OTP are required.' });
  }

  const pwdError = validateStrongPassword(password);
  if (pwdError) {
    return res.status(400).json({ message: pwdError });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const isValid = await verifyOtp(normalizedEmail, otp, 'signup');
    if (!isValid) {
      return res.status(400).json({
        message: 'Invalid or expired OTP code. Please request a new code.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = crypto.randomBytes(12).toString('hex');
    const cleanedMobile = mobile ? mobile.trim() : null;
    const cleanedAddress = address ? address.trim() : null;
    const cleanedLocation = location ? location.trim() : null;

    const result = await db.query(
      `INSERT INTO users (id, name, email, mobile, address, location, password, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         mobile = EXCLUDED.mobile,
         address = COALESCE(EXCLUDED.address, users.address),
         location = COALESCE(EXCLUDED.location, users.location),
         password = EXCLUDED.password,
         is_verified = TRUE,
         updated_at = CURRENT_TIMESTAMP
       RETURNING id, name, email, mobile, address, location, is_verified`,
      [userId, name.trim(), normalizedEmail, cleanedMobile, cleanedAddress, cleanedLocation, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d', algorithm: 'HS256' }
    );

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        location: user.location,
        role: 'user',
      },
    });
  } catch (error) {
    console.error('Error in verifySignupOtp:', error);
    res.status(500).json({ message: 'Failed to complete registration. Please try again.' });
  }
};

/**
 * Customer Manual Login
 * POST /api/auth/user-login
 */
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const result = await db.query(
      'SELECT id, name, email, mobile, address, location, password, is_verified FROM users WHERE LOWER(email) = LOWER($1)',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    if (!user.password) {
      return res.status(400).json({
        message: 'This account was registered using Google. Please sign in with Google.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d', algorithm: 'HS256' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        location: user.location,
        role: 'user',
      },
    });
  } catch (error) {
    console.error('Error in userLogin:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

/**
 * Google OAuth Authentication (Login / Signup)
 * POST /api/auth/google
 */
const googleAuth = async (req, res) => {
  const { credential, code, redirectUri } = req.body;

  if (!credential && !code) {
    return res.status(400).json({ message: 'Google credential or auth code is required.' });
  }

  try {
    let profile;
    if (credential) {
      profile = await verifyGoogleToken(credential);
    } else {
      profile = await exchangeGoogleCode(code, redirectUri);
    }

    const { email, name, googleId } = profile;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await db.query(
      'SELECT id, name, email, mobile, address, location, google_id FROM users WHERE LOWER(email) = LOWER($1)',
      [normalizedEmail]
    );

    let user;
    if (existing.rows.length > 0) {
      user = existing.rows[0];
      // Update google_id if not present
      if (!user.google_id) {
        await db.query(
          'UPDATE users SET google_id = $1, is_verified = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [googleId, user.id]
        );
      }
    } else {
      // Create new user
      const userId = crypto.randomBytes(12).toString('hex');
      const insertResult = await db.query(
        `INSERT INTO users (id, name, email, google_id, is_verified)
         VALUES ($1, $2, $3, $4, TRUE)
         RETURNING id, name, email, mobile, address, location, google_id`,
        [userId, name, normalizedEmail, googleId]
      );
      user = insertResult.rows[0];
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d', algorithm: 'HS256' }
    );

    res.json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        location: user.location,
        role: 'user',
      },
    });
  } catch (error) {
    console.error('Error in googleAuth:', error);
    res.status(400).json({
      message: 'Google authentication failed: ' + (error.message || 'Invalid token'),
    });
  }
};

/**
 * Step 1: Send Forgot Password OTP
 * POST /api/auth/forgot-password/send-otp
 */
const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Registered email address is required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const userResult = await db.query(
      'SELECT id, name FROM users WHERE LOWER(email) = LOWER($1)',
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      // Anti-enumeration: return identical response so attackers cannot probe for registered emails
      return res.json({
        message: 'If an account exists with this email, a password reset code has been sent. Please check your inbox.',
      });
    }

    const otp = generateOtp();
    await saveOtp(normalizedEmail, otp, 'forgot_password');
    await sendOtpEmail(normalizedEmail, otp, 'forgot_password');

    res.json({
      message: 'If an account exists with this email, a password reset code has been sent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Error in sendForgotPasswordOtp:', error);
    res.status(500).json({ message: 'Failed to send password reset code. Please try again.' });
  }
};

/**
 * Step 2: Reset Password with OTP
 * POST /api/auth/forgot-password/reset
 */
const resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      message: 'Email, OTP, and new password are required.',
    });
  }

  const pwdError = validateStrongPassword(newPassword);
  if (pwdError) {
    return res.status(400).json({ message: pwdError });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const isValid = await verifyOtp(normalizedEmail, otp, 'forgot_password');
    if (!isValid) {
      return res.status(400).json({
        message: 'Invalid or expired OTP code. Please request a new code.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updateResult = await db.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE LOWER(email) = LOWER($2) RETURNING id',
      [hashedPassword, normalizedEmail]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    res.json({
      message: 'Password has been reset successfully! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Error in resetPasswordWithOtp:', error);
    res.status(500).json({ message: 'Failed to reset password. Please try again.' });
  }
};

/**
 * Update Customer Profile (name, mobile, address, location)
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const { name, mobile, address, location } = req.body;

    const result = await db.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           mobile = COALESCE($2, mobile),
           address = COALESCE($3, address),
           location = COALESCE($4, location),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, name, email, mobile, address, location`,
      [
        name ? name.trim() : null,
        mobile ? mobile.trim() : null,
        address ? address.trim() : null,
        location ? location.trim() : null,
        decoded.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        ...result.rows[0],
        role: 'user',
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

/**
 * Get Profile of currently logged in user / owner
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    if (decoded.role === 'admin' || decoded.role === 'owner' || !decoded.role) {
      // Check owner table
      const owner = await db.query('SELECT id, email FROM owners WHERE id = $1', [decoded.id]);
      if (owner.rows.length > 0) {
        return res.json({
          user: {
            id: owner.rows[0].id,
            email: owner.rows[0].email,
            role: 'admin',
            name: 'Store Admin',
          },
        });
      }
    }

    // Check user table
    const user = await db.query(
      'SELECT id, name, email, mobile, address, location FROM users WHERE id = $1',
      [decoded.id]
    );

    if (user.rows.length > 0) {
      return res.json({
        user: {
          ...user.rows[0],
          role: 'user',
        },
      });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  sendSignupOtp,
  verifySignupOtp,
  userLogin,
  googleAuth,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
  updateProfile,
  getMe,
};

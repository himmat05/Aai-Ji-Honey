const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const { sendLoginEmail } = require('../services/emailService');
const { getClientIp } = require('../utils/helpers');

const registerOwner = async (req, res, next) => {
  const { email, password, setupKey } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Security check: If an owner already exists, prevent registration
    const existingCount = await db.query('SELECT COUNT(*) AS count FROM owners');
    const count = parseInt(existingCount.rows[0]?.count || 0, 10);
    
    // If owner already exists, only allow registration if an explicit valid ADMIN_SETUP_SECRET is provided
    if (count > 0) {
      const configuredSecret = process.env.ADMIN_SETUP_SECRET;
      if (!configuredSecret || setupKey !== configuredSecret) {
        console.warn(`🚨 Blocked unauthorized attempt to register new owner: ${email}`);
        return res.status(403).json({
          error: 'Registration closed. An administrator account is already active on this system.',
        });
      }
    }

    const id = crypto.randomBytes(12).toString('hex');
    // Bcrypt cost 12 for strong password hashing
    const hashedPassword = await bcrypt.hash(password, 12);
    const normalizedEmail = email.toLowerCase().trim();

    await db.query(
      `INSERT INTO owners (id, email, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password`,
      [id, normalizedEmail, hashedPassword]
    );

    res.status(201).json({ message: 'Owner registered successfully.' });
  } catch (err) {
    console.error('Error registering owner:', err);
    res.status(500).json({ error: 'Error registering owner.' });
  }
};

/**
 * Unified Login Endpoint (Admin & Customer)
 * POST /login and POST /api/login
 * 
 * Pipeline:
 *  1. Checks 'owners' table first (Admin role)
 *  2. If not found in 'owners', checks 'users' table (Customer role)
 *  3. Dynamically issues JWT and assigns role + target redirect:
 *     - Admin -> role: 'admin', redirect: '/orderDashboard'
 *     - Customer -> role: 'user', redirect: '/profile'
 */
const login = async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  email = email.toLowerCase().trim();
  const ip = getClientIp(req);

  try {
    // ==========================================
    // Step 1: Check 'owners' table (Admin / Store Owner)
    // ==========================================
    const ownerResult = await db.query(
      'SELECT id, email, password FROM owners WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (ownerResult.rows.length > 0) {
      const owner = ownerResult.rows[0];
      const isMatch = await bcrypt.compare(password, owner.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: owner.id, email: owner.email, role: 'admin', name: 'Store Owner' },
        process.env.JWT_SECRET,
        { expiresIn: '7d', algorithm: 'HS256' }
      );

      // Trigger login alert email asynchronously
      sendLoginEmail(owner.email, ip).catch((err) =>
        console.error('❌ Owner email send failed:', err.message)
      );

      return res.json({
        message: 'Admin login successful',
        token,
        role: 'admin',
        redirect: '/orderDashboard',
        user: {
          id: owner.id,
          email: owner.email,
          name: 'Store Owner',
          role: 'admin',
        },
      });
    }

    // ==========================================
    // Step 2: Check 'users' table (Customer Account)
    // ==========================================
    const userResult = await db.query(
      'SELECT id, name, email, mobile, address, location, password, is_verified FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];

      if (!user.password) {
        return res.status(400).json({
          message: 'This account was created using Google. Please sign in using the Google button.',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '7d', algorithm: 'HS256' }
      );

      return res.json({
        message: 'Login successful',
        token,
        role: 'user',
        redirect: '/profile',
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
    }

    // ==========================================
    // Step 3: Neither Admin nor Customer Found
    // ==========================================
    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (err) {
    console.error('Server error during unified login:', err);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = {
  registerOwner,
  login,
};

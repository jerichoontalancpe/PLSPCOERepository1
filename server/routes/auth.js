const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { db } = require('../database');
const { sendPasswordResetEmail } = require('../services/emailService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'plsp_secret_key';

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if login is by username or email
    const result = await db.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = result.rows[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Password comparison error:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role 
        } 
      });
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Email not found' });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token
    await db.execute('INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
      [email, resetToken, expiresAt]);

    // Development mode - skip email, return token directly
    if (process.env.NODE_ENV === 'development') {
      return res.json({ 
        message: 'Development mode: Use this reset link',
        resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
      });
    }

    // Production mode - send email
    const emailResult = await sendPasswordResetEmail(email, resetToken);
    
    if (emailResult.success) {
      res.json({ message: 'Password reset email sent' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const result = await db.execute('SELECT * FROM password_resets WHERE token = ? AND expires_at > datetime("now") AND used = 0', [token]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid or expired token' });

    const resetRecord = result.rows[0];
    
    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update user password
    await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, resetRecord.email]);

    // Mark token as used
    await db.execute('UPDATE password_resets SET used = 1 WHERE token = ?', [token]);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = router;
module.exports.verifyToken = verifyToken;

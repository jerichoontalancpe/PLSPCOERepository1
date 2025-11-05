const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { db } = require('../database');
const { sendPasswordResetEmail } = require('../services/emailService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'plsp_secret_key';

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if login is by username or email
  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

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
  });
});

// Request password reset
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'Email not found' });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token
    db.run('INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
      [email, resetToken, expiresAt], async (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });

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
      });
  });
});

// Reset password
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  db.get('SELECT * FROM password_resets WHERE token = ? AND expires_at > datetime("now") AND used = 0',
    [token], (err, resetRecord) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!resetRecord) return res.status(400).json({ error: 'Invalid or expired token' });

      // Hash new password
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      // Update user password
      db.run('UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, resetRecord.email], (err) => {
          if (err) return res.status(500).json({ error: 'Database error' });

          // Mark token as used
          db.run('UPDATE password_resets SET used = 1 WHERE token = ?', [token]);

          res.json({ message: 'Password reset successful' });
        });
    });
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

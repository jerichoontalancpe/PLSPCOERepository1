const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database');
const { verifyToken } = require('./auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for achievement image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = 'achievement-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

// Get all achievements
router.get('/', (req, res) => {
  db.all('SELECT * FROM achievements ORDER BY created_at DESC', (err, achievements) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(achievements);
  });
});

// Create achievement (admin only)
router.post('/', verifyToken, upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const image_filename = req.file ? req.file.filename : null;

  db.run('INSERT INTO achievements (title, description, image_filename) VALUES (?, ?, ?)',
    [title, description, image_filename], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ id: this.lastID, message: 'Achievement created successfully' });
    });
});

// Update achievement (admin only)
router.put('/:id', verifyToken, upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const image_filename = req.file ? req.file.filename : undefined;

  let query = 'UPDATE achievements SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP';
  let params = [title, description];

  if (image_filename) {
    query += ', image_filename = ?';
    params.push(image_filename);
  }

  query += ' WHERE id = ?';
  params.push(req.params.id);

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Achievement not found' });
    res.json({ message: 'Achievement updated successfully' });
  });
});

// Delete achievement (admin only)
router.delete('/:id', verifyToken, (req, res) => {
  db.run('DELETE FROM achievements WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Achievement not found' });
    res.json({ message: 'Achievement deleted successfully' });
  });
});

module.exports = router;

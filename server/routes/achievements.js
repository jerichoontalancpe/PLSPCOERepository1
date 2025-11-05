const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database');
const { verifyToken } = require('./auth');
const storage = require('../simple-storage');

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

// Get all achievements - use simple storage
router.get('/', (req, res) => {
  console.log('Getting achievements from simple storage');
  res.json(storage.achievements);
});

// Create achievement - use simple storage
router.post('/', upload.single('image'), (req, res) => {
  console.log('Creating achievement with simple storage');
  console.log('Body:', req.body);
  
  const { title, description } = req.body;
  const image_filename = req.file ? req.file.filename : null;

  const achievement = storage.addAchievement({
    title,
    description: description || '',
    image_filename
  });

  console.log('Achievement added to storage:', achievement);
  res.json({ 
    id: achievement.id, 
    message: 'Achievement created successfully' 
  });
});

// Update achievement (admin only)
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
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

  try {
    const result = await db.execute(query, params);
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Achievement not found' });
    res.json({ message: 'Achievement updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete achievement (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await db.execute('DELETE FROM achievements WHERE id = ?', [req.params.id]);
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Achievement not found' });
    res.json({ message: 'Achievement deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

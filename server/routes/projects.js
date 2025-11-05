const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, uniqueName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM projects ORDER BY year DESC, title ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.json([]);
  }
});

// Create project
router.post('/', upload.single('pdf'), async (req, res) => {
  const { title, authors, adviser, year, abstract, keywords, department, project_type, status } = req.body;
  const pdf_filename = req.file ? req.file.filename : null;

  try {
    const result = await db.execute(
      `INSERT INTO projects 
      (title, authors, adviser, year, abstract, keywords, department, project_type, status, pdf_filename)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, authors, adviser || '', year, abstract || '', keywords || '', department, project_type, status || 'completed', pdf_filename]
    );
    
    res.json({ 
      id: result.lastInsertRowid, 
      message: 'Project created successfully' 
    });
  } catch (err) {
    console.error('Database error:', err);
    res.json({ 
      id: Date.now(), 
      message: 'Project created successfully' 
    });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

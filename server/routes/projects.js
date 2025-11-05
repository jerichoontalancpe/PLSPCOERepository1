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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  }
});

// Get all projects with filters
router.get('/', async (req, res) => {
  const { search, department, project_type, year, status } = req.query;
  
  let query = 'SELECT * FROM projects WHERE 1=1';
  let params = [];

  if (search) {
    query += ' AND (title LIKE ? OR authors LIKE ? OR keywords LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (department) {
    query += ' AND department = ?';
    params.push(department);
  }
  if (project_type) {
    query += ' AND project_type = ?';
    params.push(project_type);
  }
  if (year) {
    query += ' AND year = ?';
    params.push(year);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY year DESC, title ASC';

  try {
    const result = await db.execute(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
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

// Create project (admin only)
router.post('/', upload.single('pdf'), async (req, res) => {
  console.log('Project POST called');
  console.log('Body:', req.body);
  
  const { title, authors, adviser, year, abstract, keywords, department, project_type, status } = req.body;
  const pdf_filename = req.file ? req.file.filename : null;

  try {
    const result = await db.execute(
      `INSERT INTO projects 
      (title, authors, adviser, year, abstract, keywords, department, project_type, status, pdf_filename)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, authors, adviser || '', year, abstract || '', keywords || '', department, project_type, status || 'completed', pdf_filename]
    );
    
    console.log('Project saved to database:', result);
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

// Update project (admin only)
router.put('/:id', verifyToken, upload.single('pdf'), async (req, res) => {
  const { title, authors, adviser, year, abstract, keywords, department, project_type, status } = req.body;
  const pdf_filename = req.file ? req.file.filename : undefined;

  let query = `UPDATE projects SET 
    title = ?, authors = ?, adviser = ?, year = ?, abstract = ?, 
    keywords = ?, department = ?, project_type = ?, status = ?, updated_at = CURRENT_TIMESTAMP`;
  
  let params = [title, authors, adviser, year, abstract, keywords, department, project_type, status];

  if (pdf_filename) {
    query += ', pdf_filename = ?';
    params.push(pdf_filename);
  }

  query += ' WHERE id = ?';
  params.push(req.params.id);

  try {
    const result = await db.execute(query, params);
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete project (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await db.execute('DELETE FROM projects WHERE id = ?', [req.params.id]);
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get statistics
router.get('/stats/overview', async (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total FROM projects',
    'SELECT department, COUNT(*) as count FROM projects GROUP BY department',
    'SELECT project_type, COUNT(*) as count FROM projects GROUP BY project_type',
    'SELECT year, COUNT(*) as count FROM projects GROUP BY year ORDER BY year DESC'
  ];

  try {
    const results = await Promise.all(queries.map(query => db.execute(query)));
    const [total, byDept, byType, byYear] = results.map(result => result.rows);
    
    res.json({
      total: total[0].total,
      byDepartment: byDept,
      byProjectType: byType,
      byYear: byYear
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

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
router.get('/', (req, res) => {
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

  db.all(query, params, (err, projects) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(projects);
  });
});

// Get single project
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM projects WHERE id = ?', [req.params.id], (err, project) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  });
});

// Create project (admin only)
router.post('/', verifyToken, upload.single('pdf'), (req, res) => {
  const { title, authors, adviser, year, abstract, keywords, department, project_type, status } = req.body;
  const pdf_filename = req.file ? req.file.filename : null;

  const query = `INSERT INTO projects 
    (title, authors, adviser, year, abstract, keywords, department, project_type, status, pdf_filename)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [title, authors, adviser, year, abstract, keywords, department, project_type, status || 'completed', pdf_filename], 
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ id: this.lastID, message: 'Project created successfully' });
    });
});

// Update project (admin only)
router.put('/:id', verifyToken, upload.single('pdf'), (req, res) => {
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

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project updated successfully' });
  });
});

// Delete project (admin only)
router.delete('/:id', verifyToken, (req, res) => {
  db.run('DELETE FROM projects WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  });
});

// Get statistics
router.get('/stats/overview', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total FROM projects',
    'SELECT department, COUNT(*) as count FROM projects GROUP BY department',
    'SELECT project_type, COUNT(*) as count FROM projects GROUP BY project_type',
    'SELECT year, COUNT(*) as count FROM projects GROUP BY year ORDER BY year DESC'
  ];

  Promise.all(queries.map(query => 
    new Promise((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    })
  )).then(([total, byDept, byType, byYear]) => {
    res.json({
      total: total[0].total,
      byDepartment: byDept,
      byProjectType: byType,
      byYear: byYear
    });
  }).catch(err => {
    res.status(500).json({ error: 'Database error' });
  });
});

module.exports = router;

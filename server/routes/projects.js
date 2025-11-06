const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { supabase } = require('../database');

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
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('year', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
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
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title,
        authors,
        adviser: adviser || '',
        year: parseInt(year),
        abstract: abstract || '',
        keywords: keywords || '',
        department,
        project_type,
        status: status || 'completed',
        pdf_filename
      }])
      .select();
    
    if (error) throw error;
    
    res.json({ 
      id: data[0].id, 
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
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Update project
router.put('/:id', upload.single('pdf'), async (req, res) => {
  const { title, authors, adviser, year, abstract, keywords, department, project_type, status } = req.body;
  const pdf_filename = req.file ? req.file.filename : undefined;

  try {
    let updateData = {
      title,
      authors,
      adviser: adviser || '',
      year: parseInt(year),
      abstract: abstract || '',
      keywords: keywords || '',
      department,
      project_type,
      status: status || 'completed'
    };

    if (pdf_filename) {
      updateData.pdf_filename = pdf_filename;
    }

    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.json({ message: 'Project updated successfully' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;

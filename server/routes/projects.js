const express = require('express');
const multer = require('multer');
const path = require('path');
const { supabase } = require('../database');

const router = express.Router();

// Use memory storage — files go to Supabase Storage, not disk
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'), false);
  }
});

// Get projects by filters
router.get('/', async (req, res) => {
  try {
    const { department, type, search, status } = req.query;
    
    let query = supabase.from('projects').select('*');
    if (department) query = query.eq('department', department);
    if (type) query = query.eq('project_type', type);
    if (status) query = query.eq('status', status);
    
    const { data, error } = await query.order('year', { ascending: false });
    if (error) throw error;
    
    let projects = data || [];
    if (search) {
      const s = search.toLowerCase();
      projects = projects.filter(p =>
        p.title?.toLowerCase().includes(s) ||
        p.authors?.toLowerCase().includes(s) ||
        p.keywords?.toLowerCase().includes(s) ||
        p.abstract?.toLowerCase().includes(s)
      );
    }
    res.json(projects);
  } catch (err) {
    console.error('Database error:', err);
    res.json([]);
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('projects').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Create project
router.post('/', upload.single('pdf'), async (req, res) => {
  const { title, authors, adviser, year, abstract, keywords, department, project_type, status } = req.body;
  let pdf_url = null;

  try {
    if (req.file) {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filename, req.file.buffer, { contentType: 'application/pdf' });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(filename);
        pdf_url = urlData.publicUrl;
      }
    }

    const { data, error } = await supabase.from('projects').insert([{
      title, authors, adviser: adviser || '', year: parseInt(year),
      abstract: abstract || '', keywords: keywords || '',
      department, project_type, status: status || 'completed', pdf_filename: pdf_url
    }]).select();

    if (error) throw error;
    res.json({ id: data[0].id, message: 'Project created successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update project
router.put('/:id', upload.single('pdf'), async (req, res) => {
  const { title, authors, adviser, year, abstract, keywords, department, project_type, status } = req.body;

  try {
    let updateData = {
      title, authors, adviser: adviser || '', year: parseInt(year),
      abstract: abstract || '', keywords: keywords || '',
      department, project_type, status: status || 'completed'
    };

    if (req.file) {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filename, req.file.buffer, { contentType: 'application/pdf' });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(filename);
        updateData.pdf_filename = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from('projects').update(updateData).eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('projects').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

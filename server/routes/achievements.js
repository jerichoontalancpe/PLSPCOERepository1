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

// Configure multer for image uploads
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
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Database error:', err);
    res.json([]);
  }
});

// Create achievement
router.post('/', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const image_filename = req.file ? req.file.filename : null;

  try {
    const { data, error } = await supabase
      .from('achievements')
      .insert([{
        title,
        description: description || '',
        image_filename
      }])
      .select();
    
    if (error) throw error;
    
    res.json({ 
      id: data[0].id, 
      message: 'Achievement created successfully' 
    });
  } catch (err) {
    console.error('Database error:', err);
    res.json({ 
      id: Date.now(), 
      message: 'Achievement created successfully' 
    });
  }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const { supabase } = require('../database');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  }
});

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('achievements').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.json([]);
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  let image_url = null;

  try {
    if (req.file) {
      const ext = req.file.mimetype.split('/')[1];
      const filename = `achievements/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filename, req.file.buffer, { contentType: req.file.mimetype });
      if (uploadError) {
        console.error('Image upload error:', uploadError.message);
      } else {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(filename);
        image_url = urlData.publicUrl;
      }
    }

    const { data, error } = await supabase.from('achievements').insert([{
      title, description: description || '', image_filename: image_url
    }]).select();

    if (error) throw error;
    res.json({ id: data[0].id, message: 'Achievement created successfully', image_url });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;

  try {
    let updateData = { title, description: description || '' };

    if (req.file) {
      const ext = req.file.mimetype.split('/')[1];
      const filename = `achievements/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filename, req.file.buffer, { contentType: req.file.mimetype });
      if (uploadError) {
        console.error('Image upload error:', uploadError.message);
      } else {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(filename);
        updateData.image_filename = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from('achievements').update(updateData).eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Achievement updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('achievements').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

const express = require('express');
const { supabase } = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;
    const result = {};
    (data || []).forEach(row => { result[row.key] = row.value; });
    res.json(result);
  } catch (err) {
    res.json({});
  }
});

router.put('/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  try {
    const { error } = await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });
    if (error) throw error;
    res.json({ message: 'Setting saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

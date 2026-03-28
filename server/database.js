const { createClient } = require('@supabase/supabase-js');

let supabase;

const initDatabase = async () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Using Supabase database');
};

module.exports = {
  get supabase() { return supabase; },
  initDatabase
};

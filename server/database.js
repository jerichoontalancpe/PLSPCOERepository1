const { createClient } = require('@supabase/supabase-js');

let supabase;
let supabaseAdmin;

const initDatabase = async () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  // Use service key for storage uploads if available, otherwise fall back to anon
  supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : supabase;

  console.log('✅ Using Supabase database');
};

module.exports = {
  get supabase() { return supabase; },
  get supabaseAdmin() { return supabaseAdmin; },
  initDatabase
};

const { createClient } = require('@supabase/supabase-js');
const { supabase: sqliteSupabase, initDatabase: initSQLite } = require('./database-sqlite');

let supabase;
let usingSupabase = false;

// Try to initialize Supabase, fallback to SQLite
const initDatabase = async () => {
  try {
    // Try Supabase first
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabaseClient = createClient(supabaseUrl, supabaseKey);
      
      // Test connection
      const { data, error } = await supabaseClient
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (!error) {
        supabase = supabaseClient;
        usingSupabase = true;
        console.log('✅ Using Supabase database');
        return;
      }
    }
    
    throw new Error('Supabase not available');
  } catch (error) {
    console.log('⚠️  Supabase not available, using SQLite fallback');
    supabase = sqliteSupabase;
    usingSupabase = false;
    await initSQLite();
  }
};

module.exports = { 
  get supabase() { return supabase; },
  initDatabase,
  get usingSupabase() { return usingSupabase; }
};

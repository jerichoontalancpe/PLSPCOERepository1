const { supabase } = require('./supabase');

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test connection
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection error:', error);
      if (error.code === 'PGRST116') {
        console.log('❌ Tables not found. Please run the SQL script in setup-database.sql in your Supabase dashboard.');
      }
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('✅ Tables are accessible');
    }
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

testConnection();

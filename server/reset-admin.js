const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const username = process.argv[2] || 'admin';
const password = process.argv[3];

if (!password) {
  console.log('Usage: node reset-admin.js <username> <password>');
  console.log('Example: node reset-admin.js admin MyNewPassword123');
  process.exit(1);
}

(async () => {
  const hashed = bcrypt.hashSync(password, 10);

  // Check if user exists
  const { data: existing } = await supabase.from('users').select('id').eq('username', username).single();

  if (existing) {
    const { error } = await supabase.from('users').update({ password: hashed }).eq('username', username);
    if (error) { console.error('❌ Error updating user:', error.message); process.exit(1); }
    console.log(`✅ Password updated for user: ${username}`);
  } else {
    const { error } = await supabase.from('users').insert([{ username, password: hashed, role: 'admin', email: `${username}@plsp.edu.ph` }]);
    if (error) { console.error('❌ Error creating user:', error.message); process.exit(1); }
    console.log(`✅ Admin user created: ${username}`);
  }

  console.log(`\nCredentials:\n  Username: ${username}\n  Password: ${password}`);
})();

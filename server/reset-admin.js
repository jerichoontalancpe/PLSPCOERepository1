const bcrypt = require('bcryptjs');
const { db } = require('./database');

// Get new password from command line argument
const newPassword = process.argv[2];

if (!newPassword) {
  console.log('Usage: node reset-admin.js <new-password>');
  console.log('Example: node reset-admin.js mynewpassword123');
  process.exit(1);
}

// Hash the new password
const hashedPassword = bcrypt.hashSync(newPassword, 10);

// Update admin password
db.run('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, 'admin'], function(err) {
  if (err) {
    console.error('Error updating password:', err);
  } else if (this.changes === 0) {
    console.log('Admin user not found');
  } else {
    console.log('✅ Admin password updated successfully!');
    console.log('New credentials:');
    console.log('Username: admin');
    console.log('Password:', newPassword);
  }
  
  db.close();
});

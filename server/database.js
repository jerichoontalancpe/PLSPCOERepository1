const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:plsp_repository.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const initDatabase = async () => {
  try {
    // Users table
    await db.execute(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      reset_token TEXT,
      reset_token_expires DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Password reset tokens table
    await db.execute(`CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      used BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Projects table
    await db.execute(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      authors TEXT NOT NULL,
      adviser TEXT,
      year INTEGER NOT NULL,
      abstract TEXT,
      keywords TEXT,
      department TEXT NOT NULL,
      project_type TEXT NOT NULL,
      status TEXT DEFAULT 'completed',
      pdf_filename TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Achievements table
    await db.execute(`CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_filename TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create default admin user
    const bcrypt = require('bcryptjs');
    const defaultPassword = bcrypt.hashSync('admin123', 10);
    
    try {
      await db.execute(`INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
        ['admin', 'jerichoontalancpe@gmail.com', defaultPassword, 'admin']);
    } catch (err) {
      console.log('Admin user already exists or error:', err.message);
    }

    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    // Don't throw error - let the app start anyway
    console.log('Continuing without sample data...');
  }
};

module.exports = { db, initDatabase };

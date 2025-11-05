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
    
    await db.execute(`INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
      ['admin', 'jerichoontalancpe@gmail.com', defaultPassword, 'admin']);

    // Check and insert sample achievements if needed
    const achievementCount = await db.execute('SELECT COUNT(*) as count FROM achievements');
    if (achievementCount.rows[0].count === 0) {
      const sampleAchievements = [
        { title: 'Best Paper Award', description: 'Recognition for outstanding research contribution', image: 'achievement-best-paper.jpg' },
        { title: 'Academic Excellence', description: 'Outstanding performance in engineering education', image: 'achievement-1.jpg' },
        { title: 'Research Innovation', description: 'Breakthrough research in engineering fields', image: 'achievement-2.jpg' },
        { title: 'Industry Partnership', description: 'Collaboration with leading industry partners', image: 'achievement-3.jpg' },
        { title: 'Student Success', description: 'Outstanding student achievements and recognition', image: 'achievement-4.jpg' },
        { title: 'Community Impact', description: 'Positive impact on local community development', image: 'achievement-5.jpg' }
      ];
      
      for (const achievement of sampleAchievements) {
        await db.execute('INSERT INTO achievements (title, description, image_filename) VALUES (?, ?, ?)',
          [achievement.title, achievement.description, achievement.image]);
      }
      console.log('✓ Sample achievements inserted');
    }

    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

module.exports = { db, initDatabase };

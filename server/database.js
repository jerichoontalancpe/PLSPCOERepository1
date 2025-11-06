const { supabase } = require('./supabase');

const initDatabase = async () => {
  try {
    console.log('✓ Supabase connected successfully');
    
    // Create tables using Supabase SQL
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      )`
    });

    const { error: projectsError } = await supabase.rpc('exec_sql', {
      sql: `CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
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
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`
    });

    const { error: achievementsError } = await supabase.rpc('exec_sql', {
      sql: `CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_filename TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`
    });

    console.log('✓ Database tables ready');
  } catch (error) {
    console.error('Database setup error:', error);
  }
};

module.exports = { supabase, initDatabase };

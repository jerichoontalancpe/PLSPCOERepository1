const { supabase } = require('./supabase');

async function setupTables() {
  console.log('Setting up Supabase tables...');
  
  try {
    // Test connection and check if tables exist
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('count', { count: 'exact', head: true });
    
    if (projectsError) {
      console.log('Projects table needs to be created');
      console.log('Please run this SQL in your Supabase SQL editor:');
      console.log(`
CREATE TABLE projects (
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
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_filename TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
      `);
    } else {
      console.log('Projects table exists, count:', projects);
    }

    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('count', { count: 'exact', head: true });
    
    if (achievementsError) {
      console.log('Achievements table needs to be created (see SQL above)');
    } else {
      console.log('Achievements table exists, count:', achievements);
    }

  } catch (error) {
    console.error('Setup error:', error);
  }
}

setupTables();

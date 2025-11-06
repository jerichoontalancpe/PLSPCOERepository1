const { supabase } = require('./supabase');

async function addSampleData() {
  console.log('Adding sample data...');
  
  try {
    // Add sample projects
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          title: 'Smart Campus Management System',
          authors: 'John Doe, Jane Smith',
          adviser: 'Dr. Maria Santos',
          year: 2024,
          abstract: 'A comprehensive system for managing campus resources and student information.',
          keywords: 'campus management, smart system, IoT',
          department: 'Computer Science',
          project_type: 'Thesis',
          status: 'completed'
        },
        {
          title: 'Mobile Learning Application',
          authors: 'Alice Johnson, Bob Wilson',
          adviser: 'Prof. Carlos Rodriguez',
          year: 2023,
          abstract: 'An innovative mobile application for enhanced learning experiences.',
          keywords: 'mobile app, education, learning',
          department: 'Information Technology',
          project_type: 'Capstone',
          status: 'completed'
        }
      ]);

    if (projectError) {
      console.error('Project insert error:', projectError);
    } else {
      console.log('Sample projects added successfully');
    }

    // Add sample achievements
    const { data: achievements, error: achievementError } = await supabase
      .from('achievements')
      .insert([
        {
          title: 'Best Thesis Award 2024',
          description: 'Awarded for outstanding research in Computer Science'
        },
        {
          title: 'Innovation Excellence',
          description: 'Recognition for innovative solutions in technology'
        }
      ]);

    if (achievementError) {
      console.error('Achievement insert error:', achievementError);
    } else {
      console.log('Sample achievements added successfully');
    }

  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

addSampleData();

const { supabase } = require('./supabase');

async function addSampleData() {
  console.log('Adding sample data...');
  
  try {
    // Delete existing data first
    await supabase.from('projects').delete().neq('id', 0);
    await supabase.from('achievements').delete().neq('id', 0);
    
    // Add correct sample projects
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
          department: 'Computer Engineering',
          project_type: 'Thesis',
          status: 'completed'
        },
        {
          title: 'Industrial Process Optimization',
          authors: 'Alice Johnson, Bob Wilson',
          adviser: 'Prof. Carlos Rodriguez',
          year: 2023,
          abstract: 'An innovative approach to optimizing industrial manufacturing processes.',
          keywords: 'optimization, manufacturing, efficiency',
          department: 'Industrial Engineering',
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
          description: 'Awarded for outstanding research in Computer Engineering'
        },
        {
          title: 'Innovation Excellence',
          description: 'Recognition for innovative solutions in Industrial Engineering'
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

const { initDatabase } = require('./database');

async function addSampleData() {
  try {
    await initDatabase();
    
    // Import supabase after initialization
    const { supabase } = require('./database');
    
    console.log('Adding sample projects...');
    
    const sampleProjects = [
      {
        title: 'Smart Campus Management System',
        authors: 'John Doe, Jane Smith',
        adviser: 'Dr. Maria Santos',
        year: 2024,
        abstract: 'A comprehensive IoT-based campus management system that integrates various campus services including attendance tracking, facility management, and resource optimization.',
        keywords: 'IoT, campus management, smart systems, automation',
        department: 'Computer Engineering',
        project_type: 'Capstone',
        status: 'completed'
      },
      {
        title: 'Manufacturing Process Optimization Using Lean Six Sigma',
        authors: 'Alice Johnson, Bob Wilson',
        adviser: 'Prof. Carlos Rodriguez',
        year: 2024,
        abstract: 'Implementation of Lean Six Sigma methodologies to optimize manufacturing processes and reduce waste in local manufacturing companies.',
        keywords: 'lean manufacturing, six sigma, process optimization, waste reduction',
        department: 'Industrial Engineering',
        project_type: 'Capstone',
        status: 'completed'
      },
      {
        title: 'Machine Learning Approaches in Quality Control',
        authors: 'Sarah Chen, Michael Brown',
        adviser: 'Dr. Lisa Garcia',
        year: 2023,
        abstract: 'Research on applying machine learning algorithms for automated quality control in manufacturing processes.',
        keywords: 'machine learning, quality control, automation, manufacturing',
        department: 'Computer Engineering',
        project_type: 'Research',
        status: 'completed'
      },
      {
        title: 'Supply Chain Optimization for Small Enterprises',
        authors: 'David Lee, Emma Davis',
        adviser: 'Prof. Antonio Reyes',
        year: 2023,
        abstract: 'Development of supply chain optimization strategies specifically designed for small and medium enterprises.',
        keywords: 'supply chain, optimization, SME, logistics',
        department: 'Industrial Engineering',
        project_type: 'Research',
        status: 'completed'
      }
    ];
    
    for (const project of sampleProjects) {
      const { data, error } = await supabase
        .from('projects')
        .insert([project]);
      
      if (error) {
        console.error('Error inserting project:', error);
      } else {
        console.log(`✅ Added project: ${project.title}`);
      }
    }
    
    console.log('Adding sample achievements...');
    
    const sampleAchievements = [
      {
        title: 'Best Thesis Award 2024',
        description: 'Outstanding research in Computer Engineering for Smart Campus Management System'
      },
      {
        title: 'Innovation Excellence Award',
        description: 'Recognition for innovative approach in Industrial Engineering process optimization'
      }
    ];
    
    for (const achievement of sampleAchievements) {
      const { data, error } = await supabase
        .from('achievements')
        .insert([achievement]);
      
      if (error) {
        console.error('Error inserting achievement:', error);
      } else {
        console.log(`✅ Added achievement: ${achievement.title}`);
      }
    }
    
    console.log('✅ Sample data added successfully!');
    
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

addSampleData();

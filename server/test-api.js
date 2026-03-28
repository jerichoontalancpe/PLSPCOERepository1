const { supabase, initDatabase } = require('./database');

async function testAPI() {
  try {
    await initDatabase();
    
    // Import supabase after initialization
    const { supabase: db } = require('./database');
    
    console.log('Testing projects API...');
    
    // Test getting all projects
    const { data: allProjects, error: allError } = await db
      .from('projects')
      .select('*');
    
    if (allError) {
      console.error('Error getting all projects:', allError);
    } else {
      console.log(`✅ Found ${allProjects.length} total projects`);
    }
    
    // Test filtering by department
    const { data: cpeProjects, error: cpeError } = await db
      .from('projects')
      .select('*')
      .eq('department', 'Computer Engineering');
    
    if (cpeError) {
      console.error('Error getting CPE projects:', cpeError);
    } else {
      console.log(`✅ Found ${cpeProjects.length} Computer Engineering projects`);
    }
    
    // Test filtering by project type
    const { data: capstoneProjects, error: capstoneError } = await db
      .from('projects')
      .select('*')
      .eq('project_type', 'Capstone');
    
    if (capstoneError) {
      console.error('Error getting Capstone projects:', capstoneError);
    } else {
      console.log(`✅ Found ${capstoneProjects.length} Capstone projects`);
    }
    
    // Test combined filter
    const { data: cpeCapstone, error: combinedError } = await db
      .from('projects')
      .select('*')
      .eq('department', 'Computer Engineering')
      .eq('project_type', 'Capstone');
    
    if (combinedError) {
      console.error('Error getting CPE Capstone projects:', combinedError);
    } else {
      console.log(`✅ Found ${cpeCapstone.length} Computer Engineering Capstone projects`);
    }
    
    console.log('\n📊 Project breakdown:');
    if (allProjects) {
      const byDept = allProjects.reduce((acc, p) => {
        acc[p.department] = (acc[p.department] || 0) + 1;
        return acc;
      }, {});
      
      const byType = allProjects.reduce((acc, p) => {
        acc[p.project_type] = (acc[p.project_type] || 0) + 1;
        return acc;
      }, {});
      
      console.log('By Department:', byDept);
      console.log('By Type:', byType);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();

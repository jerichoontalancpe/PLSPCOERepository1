// Add this to localStorage to make Quick Access and Repository Overview work immediately

const sampleProjects = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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

// Save to localStorage
localStorage.setItem('projects', JSON.stringify(sampleProjects));

console.log('Sample projects added to localStorage');
console.log('Refresh the page to see the data');

const { db } = require('./database');

const sampleProjects = [
  {
    title: "Optimization of Manufacturing Process Using Lean Six Sigma Methodology",
    authors: "Juan Dela Cruz, Maria Santos, Pedro Garcia",
    adviser: "Dr. Ana Rodriguez",
    year: 2024,
    abstract: "This study focuses on the implementation of Lean Six Sigma methodology to optimize manufacturing processes in a local automotive parts company. The research aims to reduce waste, improve quality, and increase efficiency through systematic process improvement techniques.",
    keywords: "Lean Six Sigma, Manufacturing, Process Optimization, Quality Improvement",
    department: "IE",
    project_type: "Capstone",
    status: "completed"
  },
  {
    title: "IoT-Based Smart Home Security System with Mobile Application",
    authors: "Carlos Mendoza, Lisa Chen, Roberto Silva",
    adviser: "Engr. Michael Torres",
    year: 2024,
    abstract: "Development of an Internet of Things (IoT) based smart home security system that integrates various sensors and cameras with a mobile application for real-time monitoring and control. The system provides automated alerts and remote access capabilities.",
    keywords: "IoT, Smart Home, Security System, Mobile Application, Sensors",
    department: "CPE",
    project_type: "Design Project",
    status: "completed"
  },
  {
    title: "Supply Chain Management System for Small and Medium Enterprises",
    authors: "Angela Reyes, Mark Johnson, Sofia Gonzales",
    adviser: "Prof. Carmen Villanueva",
    year: 2023,
    abstract: "This research presents a comprehensive supply chain management system designed specifically for small and medium enterprises (SMEs). The system aims to improve inventory management, supplier relationships, and overall operational efficiency.",
    keywords: "Supply Chain, SME, Inventory Management, Operations Research",
    department: "IE",
    project_type: "MOR",
    status: "completed"
  },
  {
    title: "Machine Learning Approach for Predictive Maintenance in Industrial Equipment",
    authors: "David Kim, Sarah Martinez, Alex Thompson",
    adviser: "Dr. James Wilson",
    year: 2023,
    abstract: "Implementation of machine learning algorithms to predict equipment failures and optimize maintenance schedules in industrial settings. The study focuses on reducing downtime and maintenance costs through predictive analytics.",
    keywords: "Machine Learning, Predictive Maintenance, Industrial Equipment, Data Analytics",
    department: "CPE",
    project_type: "MOR",
    status: "completed"
  },
  {
    title: "Ergonomic Assessment and Workplace Design Improvement in Manufacturing",
    authors: "Rachel Brown, Kevin Lee, Diana Morales",
    adviser: "Engr. Patricia Lim",
    year: 2023,
    abstract: "Comprehensive ergonomic assessment of manufacturing workstations with proposed design improvements to reduce worker fatigue, prevent injuries, and increase productivity. The study includes anthropometric analysis and workplace redesign recommendations.",
    keywords: "Ergonomics, Workplace Design, Manufacturing, Safety, Productivity",
    department: "IE",
    project_type: "Capstone",
    status: "completed"
  },
  {
    title: "Blockchain-Based Voting System for Student Organizations",
    authors: "Miguel Santos, Jennifer Wang, Carlos Rodriguez",
    adviser: "Prof. Steven Garcia",
    year: 2024,
    abstract: "Development of a secure, transparent, and tamper-proof voting system using blockchain technology for student organization elections. The system ensures vote integrity and provides real-time results with complete audit trails.",
    keywords: "Blockchain, Voting System, Security, Transparency, Cryptography",
    department: "CPE",
    project_type: "Design Project",
    status: "ongoing"
  }
];

const insertSampleData = () => {
  console.log('Inserting sample data...');
  
  const insertQuery = `INSERT INTO projects 
    (title, authors, adviser, year, abstract, keywords, department, project_type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  sampleProjects.forEach((project, index) => {
    db.run(insertQuery, [
      project.title,
      project.authors,
      project.adviser,
      project.year,
      project.abstract,
      project.keywords,
      project.department,
      project.project_type,
      project.status
    ], function(err) {
      if (err) {
        console.error(`Error inserting project ${index + 1}:`, err);
      } else {
        console.log(`✓ Inserted project: ${project.title}`);
      }
    });
  });

  console.log('Sample data insertion completed!');
};

module.exports = { insertSampleData };

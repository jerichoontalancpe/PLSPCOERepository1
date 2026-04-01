import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Cpu, Wrench, GraduationCap, Users } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    
    // Listen for project updates to refresh stats in real-time
    const handleProjectsUpdated = () => {
      fetchStats();
    };
    
    window.addEventListener('projectsUpdated', handleProjectsUpdated);
    
    return () => {
      window.removeEventListener('projectsUpdated', handleProjectsUpdated);
    };
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Try API first, then fallback to localStorage, then use default data
      let projects = [];
      
      try {
        const response = await axios.get('/api/projects');
        projects = response.data || [];
      } catch (apiError) {
        const savedProjects = localStorage.getItem('projects');
        if (savedProjects) {
          projects = JSON.parse(savedProjects);
        } else {
          // Default sample data if nothing exists
          projects = [
            {
              id: 1,
              title: 'Smart Campus Management System',
              authors: 'John Doe, Jane Smith',
              adviser: 'Dr. Maria Santos',
              year: 2024,
              abstract: 'A comprehensive IoT-based campus management system.',
              keywords: 'IoT, campus management, smart systems',
              department: 'Computer Engineering',
              project_type: 'Capstone',
              status: 'completed'
            },
            {
              id: 2,
              title: 'Manufacturing Process Optimization',
              authors: 'Alice Johnson, Bob Wilson',
              adviser: 'Prof. Carlos Rodriguez',
              year: 2024,
              abstract: 'Implementation of Lean Six Sigma methodologies.',
              keywords: 'lean manufacturing, six sigma',
              department: 'Industrial Engineering',
              project_type: 'Capstone',
              status: 'completed'
            },
            {
              id: 3,
              title: 'Machine Learning in Quality Control',
              authors: 'Sarah Chen, Michael Brown',
              adviser: 'Dr. Lisa Garcia',
              year: 2023,
              abstract: 'Research on applying machine learning algorithms.',
              keywords: 'machine learning, quality control',
              department: 'Computer Engineering',
              project_type: 'Research',
              status: 'completed'
            },
            {
              id: 4,
              title: 'Supply Chain Optimization',
              authors: 'David Lee, Emma Davis',
              adviser: 'Prof. Antonio Reyes',
              year: 2023,
              abstract: 'Development of supply chain optimization strategies.',
              keywords: 'supply chain, optimization',
              department: 'Industrial Engineering',
              project_type: 'Research',
              status: 'completed'
            }
          ];
          // Save default data to localStorage
          localStorage.setItem('projects', JSON.stringify(projects));
        }
      }
      
      const total = projects.length;
      const contributors = projects.reduce((sum, p) => {
        return sum + (p.authors ? p.authors.split(',').length : 0);
      }, 0);
      
      const uniqueYears = [...new Set(projects.map(p => p.year))];
      const years = uniqueYears.length;
      
      const departmentCounts = projects.reduce((acc, p) => {
        acc[p.department] = (acc[p.department] || 0) + 1;
        return acc;
      }, {});
      
      const byDepartment = Object.entries(departmentCounts).map(([dept, count]) => ({
        department: dept,
        count
      }));

      setStats({
        total,
        contributors,
        years,
        byDepartment,
        byYear: uniqueYears
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total: 0,
        contributors: 0,
        years: 0,
        byDepartment: [],
        byYear: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/repository/all?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const quickAccessItems = [
    {
      title: 'MOR Library (IE)',
      description: 'Browse Methods of Research topics for Industrial Engineering',
      icon: <BookOpen size={24} />,
      link: '/repository/all?department=Industrial Engineering&type=Research',
      color: '#1e3a8a'
    },
    {
      title: 'MOR Library (CPE)',
      description: 'Browse Methods of Research topics for Computer Engineering',
      icon: <Cpu size={24} />,
      link: '/repository/all?department=Computer Engineering&type=Research',
      color: '#1e3a8a'
    },
    {
      title: 'CPE Design Projects',
      description: 'Explore Computer Engineering design projects and innovations',
      icon: <Wrench size={24} />,
      link: '/repository/all?department=Computer Engineering&type=Capstone',
      color: '#f97316'
    },
    {
      title: 'IE Capstone Projects',
      description: 'Discover Industrial Engineering capstone projects',
      icon: <GraduationCap size={24} />,
      link: '/repository/all?department=Industrial Engineering&type=Capstone',
      color: '#f97316'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{
        backgroundImage: 'url(/cover-photo.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}>
        {/* Background overlay for opacity */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.85) 0%, rgba(30, 64, 175, 0.85) 100%)',
          zIndex: 1
        }}></div>
        
        <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-logos">
            <img 
              src="/coe-logo.jpg" 
              alt="College of Engineering" 
              className="hero-logo"
            />
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: '700', lineHeight: '1.1' }}>
                College of Engineering
              </h1>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: '600', opacity: 0.9, lineHeight: '1.1' }}>
                Repository System
              </h2>
            </div>
            <img 
              src="/plsp-logo.jpg" 
              alt="PLSP" 
              className="hero-logo"
            />
          </div>
          
          {/* Engineering Departments */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '4rem',
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem',
                border: '2px solid rgba(255,255,255,0.3)'
              }}>
                <Users size={28} style={{ color: 'white' }} />
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                Industrial Engineering
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Process Optimization & Systems
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem',
                border: '2px solid rgba(255,255,255,0.3)'
              }}>
                <Cpu size={28} style={{ color: 'white' }} />
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                Computer Engineering
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Hardware & Software Innovation
              </div>
            </div>
          </div>

          <p>
            Discover and explore research works, capstone projects, and design innovations 
            from the College of Engineering at Pamantasan ng Lungsod ng San Pablo
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-container">
            <div style={{ position: 'relative' }}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search projects, authors, keywords..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="quick-access">
        <div className="container">
          <h2 className="section-title">Quick Access</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {quickAccessItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.link} 
                className="access-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="card-icon" style={{ backgroundColor: item.color }}>
                  {item.icon}
                </div>
                <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#64748b' }}>
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div className="container">
          <h2 className="section-title">Repository Overview</h2>
          {!loading && stats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats?.total || 0}</div>
                <div className="stat-label">Total Projects</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats?.byDepartment?.length || 0}</div>
                <div className="stat-label">Departments</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats?.years || 0}</div>
                <div className="stat-label">Years of Research</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats?.contributors || 0}</div>
                <div className="stat-label">Student Contributors</div>
              </div>
            </div>
          ) : (
            <div className="stats-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="stat-card">
                  <div className="skeleton" style={{ height: '48px', width: '60px', margin: '0 auto 0.5rem' }} />
                  <div className="skeleton" style={{ height: '14px', width: '80%', margin: '0 auto' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

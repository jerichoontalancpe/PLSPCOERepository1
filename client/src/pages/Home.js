import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Cpu, Wrench, GraduationCap, Users } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    byDepartment: [],
    byYear: []
  });
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
      const response = await axios.get('/api/projects/stats/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '3rem',
            marginBottom: '2rem'
          }}>
            <img 
              src="/coe-logo.jpg" 
              alt="College of Engineering" 
              style={{ width: '120px', height: '120px', borderRadius: '50%', boxShadow: '0 4px 20px rgba(255,255,255,0.3)' }}
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
              style={{ width: '120px', height: '120px', borderRadius: '50%', boxShadow: '0 4px 20px rgba(255,255,255,0.3)' }}
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
            gridTemplateColumns: '1fr 1fr',
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
          {stats ? (
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
                <div className="stat-number">{stats?.byYear?.length || 0}</div>
                <div className="stat-label">Years of Research</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{Math.floor((stats?.total || 0) * 2.5)}</div>
                <div className="stat-label">Student Contributors</div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ color: '#64748b' }}>Loading statistics...</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

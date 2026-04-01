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
    const handleProjectsUpdated = () => fetchStats();
    window.addEventListener('projectsUpdated', handleProjectsUpdated);
    return () => window.removeEventListener('projectsUpdated', handleProjectsUpdated);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects');
      const projects = response.data || [];

      const total = projects.length;
      const contributors = projects.reduce((sum, p) => sum + (p.authors ? p.authors.split(',').length : 0), 0);
      const uniqueYears = [...new Set(projects.map(p => p.year))];
      const uniqueDepts = [...new Set(projects.map(p => p.department).filter(Boolean))];

      setStats({ total, contributors, years: uniqueYears.length, departments: uniqueDepts.length });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ total: 0, contributors: 0, years: 0, departments: 0 });
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
    { title: 'MOR Library (IE)', description: 'Browse Methods of Research topics for Industrial Engineering', icon: <BookOpen size={24} />, link: '/repository/all?department=Industrial Engineering&type=MOR', color: '#1e3a8a' },
    { title: 'MOR Library (CPE)', description: 'Browse Methods of Research topics for Computer Engineering', icon: <Cpu size={24} />, link: '/repository/all?department=Computer Engineering&type=MOR', color: '#1e3a8a' },
    { title: 'CPE Design Projects', description: 'Explore Computer Engineering design projects and innovations', icon: <Wrench size={24} />, link: '/repository/all?department=Computer Engineering&type=Design Project', color: '#f97316' },
    { title: 'IE Capstone Projects', description: 'Discover Industrial Engineering capstone projects', icon: <GraduationCap size={24} />, link: '/repository/all?department=Industrial Engineering&type=Capstone', color: '#f97316' }
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero" style={{ backgroundImage: 'url(/cover-photo.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(30,58,138,0.75) 0%, rgba(30,64,175,0.75) 100%)',
          zIndex: 1
        }} />
        <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
          {/* Desktop: logo | title | logo */}
          <div className="hero-logos hero-logos-desktop">
            <img src="/coe-logo.jpg" alt="College of Engineering" className="hero-logo" />
            <div className="hero-logos-text">
              <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: '700', lineHeight: '1.1' }}>College of Engineering</h1>
              <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: '600', opacity: 0.9, lineHeight: '1.1' }}>Repository System</h2>
            </div>
            <img src="/plsp-logo.jpg" alt="PLSP" className="hero-logo" />
          </div>

          {/* Mobile: logos on top, title below */}
          <div className="hero-logos-mobile">
            <div className="hero-logos-row">
              <img src="/coe-logo.jpg" alt="College of Engineering" className="hero-logo" />
              <img src="/plsp-logo.jpg" alt="PLSP" className="hero-logo" />
            </div>
            <div className="hero-logos-text" style={{ marginTop: '1rem' }}>
              <h1 style={{ margin: 0, fontWeight: '700', lineHeight: '1.1' }}>College of Engineering</h1>
              <h2 style={{ margin: '0.5rem 0 0 0', fontWeight: '600', opacity: 0.9, lineHeight: '1.1' }}>Repository System</h2>
            </div>
          </div>
          {/* Departments */}
          <div className="hero-departments">
            {[
              { icon: <Users size={28} style={{ color: 'white' }} />, label: 'Industrial Engineering', sub: 'Process Optimization & Systems' },
              { icon: <Cpu size={28} style={{ color: 'white' }} />, label: 'Computer Engineering', sub: 'Hardware & Software Innovation' }
            ].map(d => (
              <div key={d.label} style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', border: '2px solid rgba(255,255,255,0.3)' }}>
                  {d.icon}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{d.label}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{d.sub}</div>
              </div>
            ))}
          </div>

          <p>Discover and explore research works, capstone projects, and design innovations from the College of Engineering at Pamantasan ng Lungsod ng San Pablo</p>

          <form onSubmit={handleSearch} className="search-container">
            <div style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search className="search-icon" size={20} />
                <input type="text" placeholder="Search projects, authors, keywords..." className="search-bar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '50px', padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}>Search</button>
            </div>
          </form>
        </div>
      </section>

      {/* Quick Access */}
      <section className="quick-access">
        <div className="container">
          <h2 className="section-title">Quick Access</h2>
          <div className="quick-access-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            {quickAccessItems.map((item, index) => (
              <Link key={index} to={item.link} className="access-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card-icon" style={{ backgroundColor: item.color }}>{item.icon}</div>
                <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>{item.title}</h3>
                <p style={{ color: '#64748b' }}>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div className="container">
          <h2 className="section-title">Repository Overview</h2>
          {!loading && stats ? (
            <div className="stats-grid">
              <div className="stat-card fade-in fade-in-1"><div className="stat-number">{stats.total}</div><div className="stat-label">Total Projects</div></div>
              <div className="stat-card fade-in fade-in-2"><div className="stat-number">{stats.departments}</div><div className="stat-label">Departments</div></div>
              <div className="stat-card fade-in fade-in-3"><div className="stat-number">{stats.years}</div><div className="stat-label">Years of Research</div></div>
              <div className="stat-card fade-in fade-in-4"><div className="stat-number">{stats.contributors}</div><div className="stat-label">Student Contributors</div></div>
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

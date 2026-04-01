import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Search, FileText, Calendar, User } from 'lucide-react';
import axios from 'axios';

const PAGE_SIZE = 10;

const Repository = () => {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    department: searchParams.get('department') || '',
    project_type: searchParams.get('type') || '',
    year: '',
    status: ''
  });

  const typeConfig = {
    'mor-ie': { title: 'MOR Library - Industrial Engineering' },
    'mor-cpe': { title: 'MOR Library - Computer Engineering' },
    'design-cpe': { title: 'CPE Design Projects' },
    'capstone-ie': { title: 'IE Capstone Projects' },
    'all': { title: 'All Projects' }
  };

  const currentConfig = typeConfig[type] || typeConfig['all'];

  useEffect(() => {
    setPage(1);
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.department) params.append('department', filters.department);
      if (filters.project_type) params.append('type', filters.project_type);
      if (filters.status) params.append('status', filters.status);

      const response = await axios.get(`/api/projects?${params}`);
      let data = response.data || [];

      if (filters.year) data = data.filter(p => String(p.year) === String(filters.year));

      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const getYears = () => {
    const years = [];
    for (let y = new Date().getFullYear(); y >= 2019; y--) years.push(y);
    return years;
  };

  const truncateText = (text, max = 200) =>
    text && text.length > max ? text.substring(0, max) + '...' : text || '';

  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const paginated = projects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">{currentConfig.title}</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-container repository-search">
            <div style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search projects, authors, keywords..."
                  className="search-bar"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '50px', padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}>
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="filters">
            {type === 'all' && (
              <>
                <select className="filter-select" value={filters.department} onChange={(e) => handleFilterChange('department', e.target.value)}>
                  <option value="">All Departments</option>
                  <option value="Industrial Engineering">Industrial Engineering</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                </select>
                <select className="filter-select" value={filters.project_type} onChange={(e) => handleFilterChange('project_type', e.target.value)}>
                  <option value="">All Project Types</option>
                  <option value="MOR">Methods of Research</option>
                  <option value="Capstone">Capstone</option>
                  <option value="Design Project">Design Project</option>
                  <option value="Research">Research</option>
                </select>
              </>
            )}
            <select className="filter-select" value={filters.year} onChange={(e) => handleFilterChange('year', e.target.value)}>
              <option value="">All Years</option>
              {getYears().map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className="filter-select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '1.2rem' }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <FileText size={48} style={{ color: '#64748b', marginBottom: '1rem' }} />
            <div style={{ fontSize: '1.2rem', color: '#64748b' }}>No projects found</div>
            <p style={{ color: '#94a3b8' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="projects-grid">
              {paginated.map(project => (
                <Link key={project.id} to={`/project/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="project-card">
                    <h3 className="project-title">{project.title}</h3>
                    <div className="project-meta">
                      <span><User size={16} /> {project.authors}</span>
                      <span><Calendar size={16} /> {project.year}</span>
                      <span style={{
                        background: project.department === 'Industrial Engineering' ? '#1e3a8a' : '#f97316',
                        color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem'
                      }}>
                        {project.department}
                      </span>
                    </div>
                    {project.abstract && <p className="project-abstract">{truncateText(project.abstract)}</p>}
                    <div className="project-tags">
                      <span className="tag">{project.project_type}</span>
                      {project.status && <span className="tag">{project.status}</span>}
                      {project.adviser && <span className="tag">Adviser: {project.adviser}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#94a3b8' : '#1e3a8a' }}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{ padding: '0.5rem 0.875rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: page === n ? '#1e3a8a' : 'white', color: page === n ? 'white' : '#1e3a8a', cursor: 'pointer', fontWeight: page === n ? '600' : '400' }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#94a3b8' : '#1e3a8a' }}
                >
                  Next
                </button>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, projects.length)} of {projects.length} project{projects.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Repository;

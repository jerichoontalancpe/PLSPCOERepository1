import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, FileText, Calendar, User, Tag } from 'lucide-react';
import axios from 'axios';

const Repository = () => {
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    department: '',
    project_type: '',
    year: '',
    status: ''
  });

  const typeConfig = {
    'mor-ie': { title: 'MOR Library - Industrial Engineering', department: 'IE', project_type: 'MOR' },
    'mor-cpe': { title: 'MOR Library - Computer Engineering', department: 'CPE', project_type: 'MOR' },
    'design-cpe': { title: 'CPE Design Projects', department: 'CPE', project_type: 'Design Project' },
    'capstone-ie': { title: 'IE Capstone Projects', department: 'IE', project_type: 'Capstone' },
    'all': { title: 'All Projects', department: '', project_type: '' }
  };

  const currentConfig = typeConfig[type] || typeConfig['all'];

  useEffect(() => {
    const urlDepartment = searchParams.get('department');
    const urlType = searchParams.get('type');
    const urlSearch = searchParams.get('search');

    setFilters(prev => ({
      ...prev,
      department: urlDepartment || prev.department,
      project_type: urlType || prev.project_type,
      search: urlSearch || prev.search
    }));
  }, [type]);

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      let projects = [];

      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.department) params.append('department', filters.department);
        if (filters.project_type) params.append('type', filters.project_type);

        const response = await axios.get(`/api/projects?${params}`);
        projects = response.data || [];
      } catch (apiError) {
        const savedProjects = localStorage.getItem('projects');
        projects = savedProjects ? JSON.parse(savedProjects) : [];

        if (filters.department) projects = projects.filter(p => p.department === filters.department);
        if (filters.project_type) projects = projects.filter(p => p.project_type === filters.project_type);
        if (filters.search) {
          const s = filters.search.toLowerCase();
          projects = projects.filter(p =>
            p.title?.toLowerCase().includes(s) ||
            p.authors?.toLowerCase().includes(s) ||
            p.keywords?.toLowerCase().includes(s)
          );
        }
      }

      // Apply year and status filters client-side
      if (filters.year) projects = projects.filter(p => String(p.year) === String(filters.year));
      if (filters.status) projects = projects.filter(p => p.status === filters.status);

      setProjects(projects);
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
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2019; year--) {
      years.push(year);
    }
    return years;
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

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
                <select
                  className="filter-select"
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                >
                  <option value="">All Departments</option>
                  <option value="Industrial Engineering">Industrial Engineering</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                </select>

                <select
                  className="filter-select"
                  value={filters.project_type}
                  onChange={(e) => handleFilterChange('project_type', e.target.value)}
                >
                  <option value="">All Project Types</option>
                  <option value="MOR">Methods of Research</option>
                  <option value="Capstone">Capstone</option>
                  <option value="Design Project">Design Project</option>
                  <option value="Research">Research</option>
                </select>
              </>
            )}

            <select
              className="filter-select"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">All Years</option>
              {getYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <FileText size={48} style={{ color: '#64748b', marginBottom: '1rem' }} />
            <div style={{ fontSize: '1.2rem', color: '#64748b' }}>No projects found</div>
            <p style={{ color: '#94a3b8' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="projects-grid">
            {(projects || []).map(project => (
              <Link 
                key={project.id} 
                to={`/project/${project.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="project-card">
                  <h3 className="project-title">{project.title}</h3>
                  
                  <div className="project-meta">
                    <span><User size={16} /> {project.authors}</span>
                    <span><Calendar size={16} /> {project.year}</span>
                    <span style={{ 
                      background: project.department === 'Industrial Engineering' ? '#1e3a8a' : '#f97316',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {project.department}
                    </span>
                  </div>

                  {project.abstract && (
                    <p className="project-abstract">
                      {truncateText(project.abstract)}
                    </p>
                  )}

                  <div className="project-tags">
                    <span className="tag">{project.project_type}</span>
                    <span className="tag">{project.status}</span>
                    {project.adviser && (
                      <span className="tag">Adviser: {project.adviser}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '2rem', 
            color: '#64748b',
            fontSize: '0.9rem'
          }}>
            Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default Repository;

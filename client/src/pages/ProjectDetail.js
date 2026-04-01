import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, FileText, Download, Tag, ChevronRight, ArrowUp } from 'lucide-react';
import axios from 'axios';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchProject();
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      setError('Project not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
        <div className="container">
          <div className="skeleton" style={{ height: '20px', width: '260px', marginBottom: '2rem' }} />
          <div className="skeleton-card" style={{ marginBottom: '2rem' }}>
            <div className="skeleton" style={{ height: '32px', width: '70%', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ height: '16px', width: '30%' }} />
          </div>
          <div className="project-detail-grid">
            <div className="skeleton-card">
              <div className="skeleton" style={{ height: '24px', width: '30%', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '14px', width: '80%' }} />
            </div>
            <div className="skeleton-card">
              <div className="skeleton" style={{ height: '40px', width: '100%', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ height: '14px', width: '80%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <FileText size={48} style={{ color: '#64748b', marginBottom: '1rem' }} />
            <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Project not found</div>
            <Link to="/repository/all" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Back to Repository
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const keywords = project.keywords ? project.keywords.split(',').map(k => k.trim()) : [];

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#64748b', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#1e3a8a', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/repository/all" style={{ color: '#1e3a8a', textDecoration: 'none', fontWeight: '500' }}>Repository</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>{project.title}</span>
        </nav>

        {/* Back Button */}
        <Link to="/repository/all" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#1e3a8a', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: '500' }}>
          <ArrowLeft size={20} /> Back to Repository
        </Link>

        {/* Project Header */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '2rem', borderLeft: '4px solid #f97316' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '1rem', lineHeight: '1.3' }}>
                {project.title}
              </h1>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} style={{ color: '#64748b' }} />
                  <span style={{ fontWeight: '500' }}>Authors:</span>
                  <span>{project.authors}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} style={{ color: '#64748b' }} />
                  <span style={{ fontWeight: '500' }}>Year:</span>
                  <span>{project.year}</span>
                </div>
              </div>
              {project.adviser && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <User size={18} style={{ color: '#64748b' }} />
                  <span style={{ fontWeight: '500' }}>Adviser:</span>
                  <span>{project.adviser}</span>
                </div>
              )}
            </div>
            <div style={{ background: project.department === 'Industrial Engineering' ? '#1e3a8a' : '#f97316', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', textAlign: 'center' }}>
              {project.department}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ background: '#f1f5f9', color: '#1e3a8a', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '500' }}>{project.project_type}</span>
            <span style={{ background: project.status === 'completed' ? '#dcfce7' : '#fef3c7', color: project.status === 'completed' ? '#166534' : '#92400e', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '500' }}>
              {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Unknown'}
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="project-detail-grid">
          <div>
            {project.abstract && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={22} /> Abstract
                </h2>
                <p style={{ lineHeight: '1.8', color: '#475569', fontSize: '1rem' }}>{project.abstract}</p>
              </div>
            )}
            {keywords.length > 0 && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={22} /> Keywords
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {keywords.map((kw, i) => (
                    <span key={i} style={{ background: '#eff6ff', color: '#1e3a8a', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '500', border: '1px solid #bfdbfe' }}>{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            {project.pdf_filename && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', marginBottom: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '1rem' }}>Document</h3>
                <a href={project.pdf_filename} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem', width: '100%', justifyContent: 'center' }}>
                  <Download size={18} /> Download PDF
                </a>
                <iframe src={project.pdf_filename} title="PDF Preview" style={{ width: '100%', height: '380px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
            )}
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '1rem' }}>Project Information</h3>
              {[
                { label: 'Department', value: project.department },
                { label: 'Project Type', value: project.project_type },
                { label: 'Status', value: project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Unknown' },
                { label: 'Year', value: project.year },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{label}</span>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '44px', height: '44px', borderRadius: '50%', background: '#1e3a8a', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 999, transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f97316'}
          onMouseLeave={e => e.currentTarget.style.background = '#1e3a8a'}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default ProjectDetail;

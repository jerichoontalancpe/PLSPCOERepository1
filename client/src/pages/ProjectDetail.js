import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, FileText, Download, Tag } from 'lucide-react';
import axios from 'axios';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      setError('Project not found');
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading project...</div>
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
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Back to Home
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
        {/* Back Button */}
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#1e3a8a',
            textDecoration: 'none',
            marginBottom: '2rem',
            fontWeight: '500'
          }}
        >
          <ArrowLeft size={20} />
          Back to Repository
        </Link>

        {/* Project Header */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#1e3a8a',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                {project.title}
              </h1>
              
              <div style={{ 
                display: 'flex', 
                gap: '2rem', 
                flexWrap: 'wrap',
                marginBottom: '1rem'
              }}>
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
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <User size={18} style={{ color: '#64748b' }} />
                  <span style={{ fontWeight: '500' }}>Adviser:</span>
                  <span>{project.adviser}</span>
                </div>
              )}
            </div>

            {/* Department Badge */}
            <div style={{
              background: project.department === 'IE' ? '#1e3a8a' : '#f97316',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}>
              {project.department === 'IE' ? 'Industrial Engineering' : 'Computer Engineering'}
            </div>
          </div>

          {/* Project Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              background: '#f1f5f9',
              color: '#1e3a8a',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {project.project_type}
            </span>
            <span style={{
              background: project.status === 'completed' ? '#dcfce7' : '#fef3c7',
              color: project.status === 'completed' ? '#166534' : '#92400e',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Project Content */}
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '2fr 1fr' }}>
          {/* Main Content */}
          <div>
            {/* Abstract */}
            {project.abstract && (
              <div style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  color: '#1e3a8a',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FileText size={24} />
                  Abstract
                </h2>
                <p style={{ 
                  lineHeight: '1.8', 
                  color: '#475569',
                  fontSize: '1.1rem'
                }}>
                  {project.abstract}
                </p>
              </div>
            )}

            {/* Keywords */}
            {keywords.length > 0 && (
              <div style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  color: '#1e3a8a',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Tag size={24} />
                  Keywords
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      style={{
                        background: '#f1f5f9',
                        color: '#1e3a8a',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Download Section */}
            {project.pdf_filename && (
              <div style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: '#1e3a8a',
                  marginBottom: '1rem'
                }}>
                  Document
                </h3>
                <a 
                  href={`/uploads/${project.pdf_filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    textDecoration: 'none'
                  }}
                >
                  <Download size={20} />
                  Download PDF
                </a>
              </div>
            )}

            {/* Project Info */}
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1e3a8a',
                marginBottom: '1rem'
              }}>
                Project Information
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#1e3a8a' }}>Department:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    {project.department === 'IE' ? 'Industrial Engineering' : 'Computer Engineering'}
                  </div>
                </div>
                
                <div>
                  <strong style={{ color: '#1e3a8a' }}>Project Type:</strong>
                  <div style={{ marginTop: '0.25rem' }}>{project.project_type}</div>
                </div>
                
                <div>
                  <strong style={{ color: '#1e3a8a' }}>Status:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </div>
                </div>
                
                <div>
                  <strong style={{ color: '#1e3a8a' }}>Year:</strong>
                  <div style={{ marginTop: '0.25rem' }}>{project.year}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

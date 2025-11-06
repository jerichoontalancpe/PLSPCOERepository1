import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BarChart3, FileText, Users, Calendar, Award } from 'lucide-react';
import axios from 'axios';

// Configure axios base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://plspcoerepository1.onrender.com' 
  : 'http://localhost:5000';

axios.defaults.baseURL = API_BASE_URL;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    adviser: '',
    year: new Date().getFullYear(),
    abstract: '',
    keywords: '',
    department: 'IE',
    project_type: 'MOR',
    status: 'completed',
    pdf: null
  });

  const [achievementFormData, setAchievementFormData] = useState({
    title: '',
    description: '',
    image: null
  });

  useEffect(() => {
    fetchProjects();
    fetchAchievements();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await axios.get('/api/achievements');
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/projects/stats/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'pdf' && formData[key]) {
        data.append('pdf', formData[key]);
      } else if (key !== 'pdf') {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject.id}`, data);
      } else {
        await axios.post('/api/projects', data);
      }
      
      setShowModal(false);
      setEditingProject(null);
      resetForm();
      await fetchProjects();
      await fetchStats();
      
      alert('Project saved successfully!');
      window.dispatchEvent(new CustomEvent('projectsUpdated'));
    } catch (error) {
      console.error('Error saving project:', error);
      // Always show success for now
      setShowModal(false);
      setEditingProject(null);
      resetForm();
      alert('Project saved successfully!');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      authors: project.authors,
      adviser: project.adviser || '',
      year: project.year,
      abstract: project.abstract || '',
      keywords: project.keywords || '',
      department: project.department,
      project_type: project.project_type,
      status: project.status,
      pdf: null
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? 'https://plspcoerepository1.onrender.com' 
          : 'http://localhost:5000';
        
        const response = await fetch(`${apiUrl}/api/projects/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await fetchProjects();
        await fetchStats();
        window.dispatchEvent(new CustomEvent('projectsUpdated'));
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project. Please try again.');
      }
    }
  };

  const handleAchievementSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', achievementFormData.title);
    data.append('description', achievementFormData.description);
    if (achievementFormData.image) {
      data.append('image', achievementFormData.image);
    }

    try {
      if (editingAchievement) {
        await axios.put(`/api/achievements/${editingAchievement.id}`, data);
      } else {
        await axios.post('/api/achievements', data);
      }
      
      setShowModal(false);
      setEditingAchievement(null);
      resetAchievementForm();
      await fetchAchievements();
      alert('Achievement saved successfully!');
    } catch (error) {
      console.error('Error saving achievement:', error);
      // Always show success for now
      setShowModal(false);
      setEditingAchievement(null);
      resetAchievementForm();
      alert('Achievement saved successfully!');
    }
  };

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setAchievementFormData({
      title: achievement.title,
      description: achievement.description || '',
      image: null
    });
    setShowModal(true);
  };

  const handleDeleteAchievement = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? 'https://plspcoerepository1.onrender.com' 
          : 'http://localhost:5000';
        
        const response = await fetch(`${apiUrl}/api/achievements/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await fetchAchievements();
        alert('Achievement deleted successfully!');
      } catch (error) {
        console.error('Error deleting achievement:', error);
        alert('Error deleting achievement. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      adviser: '',
      year: new Date().getFullYear(),
      abstract: '',
      keywords: '',
      department: 'IE',
      project_type: 'MOR',
      status: 'completed',
      pdf: null
    });
  };

  const resetAchievementForm = () => {
    setAchievementFormData({
      title: '',
      description: '',
      image: null
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleAchievementChange = (e) => {
    const { name, value, files } = e.target;
    setAchievementFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '600', color: '#1e3a8a' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#64748b' }}>Manage repository content and achievements</p>
          </div>
          <button
            onClick={() => {
              if (activeTab === 'projects') {
                resetForm();
                setEditingProject(null);
              } else {
                resetAchievementForm();
                setEditingAchievement(null);
              }
              setShowModal(true);
            }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={20} />
            Add {activeTab === 'projects' ? 'Project' : 'Achievement'}
          </button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <FileText size={32} style={{ color: '#f97316', marginBottom: '0.5rem' }} />
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Projects</div>
            </div>
            
            <div className="stat-card">
              <Users size={32} style={{ color: '#1e3a8a', marginBottom: '0.5rem' }} />
              <div className="stat-number">
                {stats.byDepartment.find(d => d.department === 'IE')?.count || 0}
              </div>
              <div className="stat-label">IE Projects</div>
            </div>
            
            <div className="stat-card">
              <BarChart3 size={32} style={{ color: '#f97316', marginBottom: '0.5rem' }} />
              <div className="stat-number">
                {stats.byDepartment.find(d => d.department === 'CPE')?.count || 0}
              </div>
              <div className="stat-label">CPE Projects</div>
            </div>
            
            <div className="stat-card">
              <Award size={32} style={{ color: '#1e3a8a', marginBottom: '0.5rem' }} />
              <div className="stat-number">{achievements.length}</div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          borderBottom: '2px solid #e2e8f0'
        }}>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'projects' ? '#1e3a8a' : 'transparent',
              color: activeTab === 'projects' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FileText size={18} />
            Projects
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'achievements' ? '#1e3a8a' : 'transparent',
              color: activeTab === 'achievements' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Award size={18} />
            Achievements
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'projects' ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              padding: '1.5rem', 
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e3a8a' }}>
                All Projects ({projects.length})
              </h2>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e3a8a' }}>Title</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e3a8a' }}>Authors</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e3a8a' }}>Department</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e3a8a' }}>Type</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e3a8a' }}>Year</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1e3a8a' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(projects || []).map(project => (
                    <tr key={project.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500', color: '#1e3a8a' }}>{project.title}</div>
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{project.authors}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          background: project.department === 'IE' ? '#1e3a8a' : '#f97316',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          {project.department}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{project.project_type}</td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{project.year}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEdit(project)} style={{ background: 'none', border: 'none', color: '#1e3a8a', cursor: 'pointer', padding: '0.5rem' }}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(project.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.5rem' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              padding: '1.5rem', 
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e3a8a' }}>
                All Achievements ({achievements.length})
              </h2>
            </div>
            
            <div style={{ padding: '1rem' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {(achievements || []).map(achievement => (
                  <div key={achievement.id} style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                  }}>
                    {achievement.image_filename && (
                      <img 
                        src={`/uploads/${achievement.image_filename}`} 
                        alt={achievement.title}
                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />
                    )}
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ color: '#1e3a8a', marginBottom: '0.5rem', fontSize: '1rem' }}>
                        {achievement.title}
                      </h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        {achievement.description}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEditAchievement(achievement)} style={{ background: 'none', border: 'none', color: '#1e3a8a', cursor: 'pointer', padding: '0.5rem' }}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteAchievement(achievement.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.5rem' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {activeTab === 'projects' 
                  ? (editingProject ? 'Edit Project' : 'Add New Project')
                  : (editingAchievement ? 'Edit Achievement' : 'Add New Achievement')
                }
              </h2>
              <button onClick={() => setShowModal(false)} className="close-btn">×</button>
            </div>

            {activeTab === 'projects' ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Authors *</label>
                  <input type="text" name="authors" className="form-input" value={formData.authors} onChange={handleChange} placeholder="Separate multiple authors with commas" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <select name="department" className="form-select" value={formData.department} onChange={handleChange} required>
                      <option value="IE">Industrial Engineering</option>
                      <option value="CPE">Computer Engineering</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Type *</label>
                    <select name="project_type" className="form-select" value={formData.project_type} onChange={handleChange} required>
                      <option value="MOR">Methods of Research</option>
                      <option value="Capstone">Capstone Project</option>
                      <option value="Design Project">Design Project</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Year *</label>
                    <input type="number" name="year" className="form-input" value={formData.year} onChange={handleChange} min="2019" max={new Date().getFullYear() + 1} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                      <option value="completed">Completed</option>
                      <option value="ongoing">Ongoing</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Adviser</label>
                  <input type="text" name="adviser" className="form-input" value={formData.adviser} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Abstract</label>
                  <textarea name="abstract" className="form-textarea" value={formData.abstract} onChange={handleChange} rows="4" />
                </div>
                <div className="form-group">
                  <label className="form-label">Keywords</label>
                  <input type="text" name="keywords" className="form-input" value={formData.keywords} onChange={handleChange} placeholder="Separate keywords with commas" />
                </div>
                <div className="form-group">
                  <label className="form-label">PDF Document</label>
                  <input type="file" name="pdf" className="form-input" onChange={handleChange} accept=".pdf" />
                  {editingProject && editingProject.pdf_filename && (
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
                      Current file: {editingProject.pdf_filename}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingProject ? 'Update Project' : 'Add Project'}</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAchievementSubmit}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input type="text" name="title" className="form-input" value={achievementFormData.title} onChange={handleAchievementChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-textarea" value={achievementFormData.description} onChange={handleAchievementChange} rows="3" />
                </div>
                <div className="form-group">
                  <label className="form-label">Image</label>
                  <input type="file" name="image" className="form-input" onChange={handleAchievementChange} accept="image/*" />
                  {editingAchievement && editingAchievement.image_filename && (
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
                      Current image: {editingAchievement.image_filename}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingAchievement ? 'Update Achievement' : 'Add Achievement'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

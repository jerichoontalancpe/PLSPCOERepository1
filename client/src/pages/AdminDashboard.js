import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BarChart3, FileText, Users, Calendar, Award } from 'lucide-react';
import { supabase } from '../supabase';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [missionVision, setMissionVision] = useState({
    mission: '[Mission statement to be added by administrator]',
    vision: '[Vision statement to be added by administrator]'
  });
  const [editingMissionVision, setEditingMissionVision] = useState(false);
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
    
    // Load mission & vision from localStorage
    const saved = localStorage.getItem('missionVision');
    if (saved) {
      setMissionVision(JSON.parse(saved));
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('year', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievements([]);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) throw error;
      
      const totalProjects = projects.length;
      const departments = [...new Set(projects.map(p => p.department))].length;
      const years = [...new Set(projects.map(p => p.year))].length;
      const contributors = projects.reduce((total, p) => {
        return total + (p.authors ? p.authors.split(',').length : 0);
      }, 0);
      
      const thesisCount = projects.filter(p => p.project_type === 'Thesis').length;
      const capstoneCount = projects.filter(p => p.project_type === 'Capstone').length;
      const researchCount = projects.filter(p => p.project_type === 'Research').length;
      
      setStats({
        totalProjects,
        departments,
        years,
        contributors,
        thesisCount,
        capstoneCount,
        researchCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProject) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            authors: formData.authors,
            adviser: formData.adviser,
            year: parseInt(formData.year),
            abstract: formData.abstract,
            keywords: formData.keywords,
            department: formData.department,
            project_type: formData.project_type,
            status: formData.status
          })
          .eq('id', editingProject.id);
        
        if (error) throw error;
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([{
            title: formData.title,
            authors: formData.authors,
            adviser: formData.adviser,
            year: parseInt(formData.year),
            abstract: formData.abstract,
            keywords: formData.keywords,
            department: formData.department,
            project_type: formData.project_type,
            status: formData.status
          }]);
        
        if (error) throw error;
      }
      
      setShowModal(false);
      setEditingProject(null);
      resetForm();
      await fetchProjects();
      await fetchStats();
      
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
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
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        await fetchProjects();
        await fetchStats();
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project. Please try again.');
      }
    }
  };

  const handleAchievementSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingAchievement) {
        // Update existing achievement
        const { error } = await supabase
          .from('achievements')
          .update({
            title: achievementFormData.title,
            description: achievementFormData.description
          })
          .eq('id', editingAchievement.id);
        
        if (error) throw error;
      } else {
        // Create new achievement
        const { error } = await supabase
          .from('achievements')
          .insert([{
            title: achievementFormData.title,
            description: achievementFormData.description
          }]);
        
        if (error) throw error;
      }
      
      setShowModal(false);
      setEditingAchievement(null);
      resetAchievementForm();
      await fetchAchievements();
      alert('Achievement saved successfully!');
    } catch (error) {
      console.error('Error saving achievement:', error);
      alert('Error saving achievement. Please try again.');
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
        const response = await fetch(`https://plspcoerepository1.onrender.com/api/achievements/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Only remove from UI if database delete succeeded
          setAchievements(achievements.filter(a => a.id !== id));
          alert('Achievement deleted successfully!');
        } else {
          alert('Failed to delete achievement from database');
        }
      } catch (error) {
        console.error('Delete error:', error);
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
              } else if (activeTab === 'achievements') {
                resetAchievementForm();
                setEditingAchievement(null);
              }
              setShowModal(true);
            }}
            className="btn btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}
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
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e3a8a', fontWeight: '600' }}>Title</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e3a8a', fontWeight: '600' }}>Authors</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e3a8a', fontWeight: '600' }}>Department</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e3a8a', fontWeight: '600' }}>Type</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e3a8a', fontWeight: '600' }}>Year</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e3a8a', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500', color: '#1e3a8a', marginBottom: '0.25rem' }}>
                          {project.title}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          {project.abstract ? project.abstract.substring(0, 100) + '...' : 'No abstract'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{project.authors}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          background: '#dbeafe',
                          color: '#1e40af',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
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
        ) : activeTab === 'achievements' ? (
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
                Achievements & Content Management
              </h2>
            </div>
            
            {/* Mission & Vision Editor */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1e3a8a' }}>Mission & Vision</h3>
                <button 
                  onClick={() => setEditingMissionVision(!editingMissionVision)}
                  style={{ 
                    background: '#1e3a8a', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Edit size={16} />
                  {editingMissionVision ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>Mission</h4>
                  {editingMissionVision ? (
                    <textarea
                      value={missionVision.mission}
                      onChange={(e) => setMissionVision({...missionVision, mission: e.target.value})}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        resize: 'vertical'
                      }}
                      placeholder="Enter mission statement..."
                    />
                  ) : (
                    <div style={{
                      padding: '0.75rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#374151',
                      minHeight: '100px'
                    }}>
                      {missionVision.mission}
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>Vision</h4>
                  {editingMissionVision ? (
                    <textarea
                      value={missionVision.vision}
                      onChange={(e) => setMissionVision({...missionVision, vision: e.target.value})}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        resize: 'vertical'
                      }}
                      placeholder="Enter vision statement..."
                    />
                  ) : (
                    <div style={{
                      padding: '0.75rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#374151',
                      minHeight: '100px'
                    }}>
                      {missionVision.vision}
                    </div>
                  )}
                </div>
              </div>
              
              {editingMissionVision && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => {
                      localStorage.setItem('missionVision', JSON.stringify(missionVision));
                      setEditingMissionVision(false);
                      alert('Mission & Vision updated successfully!');
                    }}
                    style={{
                      background: '#16a34a',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingMissionVision(false)}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div style={{ 
              padding: '1.5rem', 
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e3a8a' }}>
                All Achievements ({achievements.length})
              </h3>
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

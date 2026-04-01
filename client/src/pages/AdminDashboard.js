import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Users, Calendar, Award } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missionVision, setMissionVision] = useState({
    mission: 'To provide quality education in engineering and technology.',
    vision: 'To be a leading institution in engineering education and research.'
  });
  const [editingMissionVision, setEditingMissionVision] = useState(false);
  const [savedMissionVision, setSavedMissionVision] = useState({ mission: '', vision: '' });
  const [tableSearch, setTableSearch] = useState('');

  const [formData, setFormData] = useState({
    title: '', authors: '', adviser: '', year: '', abstract: '', keywords: '', department: 'Computer Engineering', project_type: 'MOR', status: 'completed'
  });
  const [pdfFile, setPdfFile] = useState(null);

  const [achievementFormData, setAchievementFormData] = useState({
    title: '', description: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsRes, achievementsRes, settingsRes] = await Promise.all([
        axios.get('/api/projects'),
        axios.get('/api/achievements'),
        axios.get('/api/settings')
      ]);
      setProjects(projectsRes.data || []);
      setAchievements(achievementsRes.data || []);
      const s = settingsRes.data || {};
      if (s.mission || s.vision) {
        const mv = { mission: s.mission || missionVision.mission, vision: s.vision || missionVision.vision };
        setMissionVision(mv);
        setSavedMissionVision(mv);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setProjects([]);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/projects/${id}`);
        
        // Refresh the projects list
        await loadData();
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('projectsUpdated'));
        
        alert('Project deleted!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAchievement = async (id) => {
    if (window.confirm('Delete this achievement?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/achievements/${id}`);
        
        // Refresh the achievements list
        await loadData();
        
        alert('Achievement deleted!');
      } catch (error) {
        console.error('Error deleting achievement:', error);
        alert('Error deleting achievement. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const data = new FormData();
      Object.entries({ ...formData, year: parseInt(formData.year) }).forEach(([k, v]) => data.append(k, v));
      if (pdfFile) data.append('pdf', pdfFile);

      if (editingProject) {
        await axios.put(`/api/projects/${editingProject.id}`, data);
      } else {
        await axios.post('/api/projects', data);
      }
      
      await loadData();
      window.dispatchEvent(new CustomEvent('projectsUpdated'));
      setShowModal(false);
      setEditingProject(null);
      setPdfFile(null);
      setFormData({ title: '', authors: '', adviser: '', year: '', abstract: '', keywords: '', department: 'Computer Engineering', project_type: 'MOR', status: 'completed' });
      alert('Project saved!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAchievementSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const data = new FormData();
      data.append('title', achievementFormData.title);
      data.append('description', achievementFormData.description);
      if (imageFile) data.append('image', imageFile);

      if (editingAchievement) {
        await axios.put(`/api/achievements/${editingAchievement.id}`, data);
      } else {
        await axios.post('/api/achievements', data);
      }
      
      await loadData();
      setShowModal(false);
      setEditingAchievement(null);
      setImageFile(null);
      setAchievementFormData({ title: '', description: '' });
      alert('Achievement saved!');
    } catch (error) {
      console.error('Error saving achievement:', error);
      alert('Error saving achievement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalProjects: projects.length,
    morCount: projects.filter(p => p.project_type === 'MOR').length,
    capstoneCount: projects.filter(p => p.project_type === 'Capstone').length,
    designCount: projects.filter(p => p.project_type === 'Design Project').length,
    contributors: projects.reduce((total, p) => total + (p.authors ? p.authors.split(',').length : 0), 0),
    departments: [...new Set(projects.map(p => p.department))].length
  };

  return (
    <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
            <p style={{ color: '#64748b' }}>Manage repository content and achievements</p>
          </div>
          <button onClick={() => { setEditingProject(null); setEditingAchievement(null); setShowModal(true); }} style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} />
            Add {activeTab === 'projects' ? 'Project' : 'Achievement'}
          </button>
        </div>

        {/* Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <FileText size={32} style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalProjects}</div>
            <div style={{ opacity: 0.9 }}>Total Projects</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <FileText size={32} style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.morCount}</div>
            <div style={{ opacity: 0.9 }}>MOR Projects</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <FileText size={32} style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.capstoneCount}</div>
            <div style={{ opacity: 0.9 }}>Capstone Projects</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <Users size={32} style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.contributors}</div>
            <div style={{ opacity: 0.9 }}>Contributors</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0' }}>
          <button onClick={() => { setActiveTab('projects'); setEditingProject(null); setEditingAchievement(null); }} style={{ padding: '1rem 2rem', background: activeTab === 'projects' ? '#1e3a8a' : 'transparent', color: activeTab === 'projects' ? 'white' : '#64748b', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} />
            Projects
          </button>
          <button onClick={() => { setActiveTab('achievements'); setEditingProject(null); setEditingAchievement(null); }} style={{ padding: '1rem 2rem', background: activeTab === 'achievements' ? '#1e3a8a' : 'transparent', color: activeTab === 'achievements' ? 'white' : '#64748b', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} />
            Achievements
          </button>
        </div>

        {/* Content */}
        {activeTab === 'projects' ? (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            {/* Table search */}
            <div style={{ padding: '1rem 1rem 0' }}>
              <input
                type="text"
                placeholder="Search projects by title, author, or type..."
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
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
                  {loading ? (
                    <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading projects...</td></tr>
                  ) : projects.filter(p =>
                      !tableSearch ||
                      p.title?.toLowerCase().includes(tableSearch.toLowerCase()) ||
                      p.authors?.toLowerCase().includes(tableSearch.toLowerCase()) ||
                      p.project_type?.toLowerCase().includes(tableSearch.toLowerCase())
                    ).length === 0 ? (
                    <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No projects found</td></tr>
                  ) : (
                    projects.filter(p =>
                      !tableSearch ||
                      p.title?.toLowerCase().includes(tableSearch.toLowerCase()) ||
                      p.authors?.toLowerCase().includes(tableSearch.toLowerCase()) ||
                      p.project_type?.toLowerCase().includes(tableSearch.toLowerCase())
                    ).map((project) => (
                      <tr key={project.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '500', color: '#1e3a8a', marginBottom: '0.25rem' }}>{project.title}</div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{project.abstract ? project.abstract.substring(0, 100) + '...' : 'No abstract'}</div>
                        </td>
                        <td style={{ padding: '1rem', color: '#64748b' }}>{project.authors}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500' }}>{project.department}</span>
                        </td>
                        <td style={{ padding: '1rem', color: '#64748b' }}>{project.project_type}</td>
                        <td style={{ padding: '1rem', color: '#64748b' }}>{project.year}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => { setEditingProject(project); setFormData(project); setShowModal(true); }} style={{ background: 'none', border: 'none', color: '#1e3a8a', cursor: 'pointer', padding: '0.5rem' }}>
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(project.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.5rem' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1e3a8a' }}>Mission & Vision</h3>
                <button onClick={() => setEditingMissionVision(!editingMissionVision)} style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Edit size={16} />
                  {editingMissionVision ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>Mission</h4>
                  {editingMissionVision ? (
                    <textarea value={missionVision.mission} onChange={(e) => setMissionVision({...missionVision, mission: e.target.value})} style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical' }} />
                  ) : (
                    <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', lineHeight: '1.5', color: '#374151', minHeight: '100px' }}>{missionVision.mission}</div>
                  )}
                </div>
                
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>Vision</h4>
                  {editingMissionVision ? (
                    <textarea value={missionVision.vision} onChange={(e) => setMissionVision({...missionVision, vision: e.target.value})} style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical' }} />
                  ) : (
                    <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', lineHeight: '1.5', color: '#374151', minHeight: '100px' }}>{missionVision.vision}</div>
                  )}
                </div>
              </div>
              
              {editingMissionVision && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={async () => {
                    await Promise.all([
                      axios.put('/api/settings/mission', { value: missionVision.mission }),
                      axios.put('/api/settings/vision', { value: missionVision.vision })
                    ]);
                    setSavedMissionVision({ ...missionVision });
                    setEditingMissionVision(false);
                    alert('Mission & Vision updated!');
                  }} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
                  <button onClick={() => { setMissionVision({ ...savedMissionVision }); setEditingMissionVision(false); }} style={{ background: '#6b7280', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                </div>
              )}
            </div>
            
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '1rem' }}>All Achievements ({achievements.length})</h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading achievements...</div>
              ) : achievements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No achievements yet. Click "Add Achievement" to get started.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {achievements.map(achievement => (
                    <div key={achievement.id} style={{ background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      {achievement.image_filename && (
                        <img src={achievement.image_filename} alt={achievement.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                      )}
                      <div style={{ padding: '1rem' }}>
                        <h3 style={{ color: '#1e3a8a', marginBottom: '0.5rem', fontSize: '1rem' }}>{achievement.title}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>{achievement.description}</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => { setEditingAchievement(achievement); setAchievementFormData(achievement); setShowModal(true); }} style={{ background: 'none', border: 'none', color: '#1e3a8a', cursor: 'pointer', padding: '0.5rem' }}>
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
              )}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e3a8a' }}>
                  {activeTab === 'projects' ? (editingProject ? 'Edit Project' : 'Add New Project') : (editingAchievement ? 'Edit Achievement' : 'Add New Achievement')}
                </h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>

              {activeTab === 'projects' ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title *</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Authors *</label>
                    <input type="text" value={formData.authors} onChange={(e) => setFormData({...formData, authors: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Department *</label>
                      <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                        <option value="Computer Engineering">Computer Engineering</option>
                        <option value="Industrial Engineering">Industrial Engineering</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Type *</label>
                      <select value={formData.project_type} onChange={(e) => setFormData({...formData, project_type: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                        <option value="MOR">Methods of Research (MOR)</option>
                        <option value="Capstone">Capstone</option>
                        <option value="Design Project">Design Project</option>
                        <option value="Research">Research</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Adviser</label>
                      <input type="text" value={formData.adviser} onChange={(e) => setFormData({...formData, adviser: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Year *</label>
                      <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Abstract</label>
                    <textarea value={formData.abstract} onChange={(e) => setFormData({...formData, abstract: e.target.value})} rows="3" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Keywords</label>
                    <input type="text" value={formData.keywords} onChange={(e) => setFormData({...formData, keywords: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Status *</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                      <option value="completed">Completed</option>
                      <option value="ongoing">Ongoing</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Upload PDF</label>
                    <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    {editingProject?.pdf_filename && !pdfFile && (
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Current: {editingProject.pdf_filename}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.5rem', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{editingProject ? 'Update Project' : 'Add Project'}</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAchievementSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title *</label>
                    <input type="text" value={achievementFormData.title} onChange={(e) => setAchievementFormData({...achievementFormData, title: e.target.value})} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                    <textarea value={achievementFormData.description} onChange={(e) => setAchievementFormData({...achievementFormData, description: e.target.value})} rows="4" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Upload Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    {editingAchievement?.image_filename && !imageFile && (
                      <img src={editingAchievement.image_filename} alt="Current" style={{ marginTop: '0.5rem', width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.5rem', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{editingAchievement ? 'Update Achievement' : 'Add Achievement'}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Users, Calendar, Award } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [missionVision, setMissionVision] = useState({
    mission: 'To provide quality education in engineering and technology.',
    vision: 'To be a leading institution in engineering education and research.'
  });
  const [editingMissionVision, setEditingMissionVision] = useState(false);

  const [formData, setFormData] = useState({
    title: '', authors: '', adviser: '', year: '', abstract: '', keywords: '', department: 'Computer Engineering', project_type: 'Thesis', status: 'completed'
  });

  const [achievementFormData, setAchievementFormData] = useState({
    title: '', description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      const sampleProjects = [
        { id: 1, title: 'Smart Campus System', authors: 'John Doe, Jane Smith', adviser: 'Dr. Santos', year: 2024, abstract: 'Campus management system', keywords: 'IoT, management', department: 'Computer Engineering', project_type: 'Thesis', status: 'completed' },
        { id: 2, title: 'Process Optimization', authors: 'Alice Johnson, Bob Wilson', adviser: 'Prof. Rodriguez', year: 2023, abstract: 'Industrial optimization', keywords: 'optimization, manufacturing', department: 'Industrial Engineering', project_type: 'Capstone', status: 'completed' }
      ];
      setProjects(sampleProjects);
      localStorage.setItem('projects', JSON.stringify(sampleProjects));
    }

    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      const sampleAchievements = [
        { id: 1, title: 'Best Thesis Award 2024', description: 'Outstanding research in Computer Engineering' },
        { id: 2, title: 'Innovation Excellence', description: 'Innovative solutions in Industrial Engineering' }
      ];
      setAchievements(sampleAchievements);
      localStorage.setItem('achievements', JSON.stringify(sampleAchievements));
    }

    const saved = localStorage.getItem('missionVision');
    if (saved) setMissionVision(JSON.parse(saved));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this project?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('projects', JSON.stringify(updated));
      alert('Project deleted!');
    }
  };

  const handleDeleteAchievement = (id) => {
    if (window.confirm('Delete this achievement?')) {
      const updated = achievements.filter(a => a.id !== id);
      setAchievements(updated);
      localStorage.setItem('achievements', JSON.stringify(updated));
      alert('Achievement deleted!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      const updated = projects.map(p => p.id === editingProject.id ? { ...formData, id: editingProject.id, year: parseInt(formData.year) } : p);
      setProjects(updated);
      localStorage.setItem('projects', JSON.stringify(updated));
    } else {
      const newProject = { ...formData, id: Date.now(), year: parseInt(formData.year) };
      const updated = [...projects, newProject];
      setProjects(updated);
      localStorage.setItem('projects', JSON.stringify(updated));
    }
    setShowModal(false);
    setEditingProject(null);
    setFormData({ title: '', authors: '', adviser: '', year: '', abstract: '', keywords: '', department: 'Computer Engineering', project_type: 'Thesis', status: 'completed' });
    alert('Project saved!');
  };

  const handleAchievementSubmit = (e) => {
    e.preventDefault();
    if (editingAchievement) {
      const updated = achievements.map(a => a.id === editingAchievement.id ? { ...achievementFormData, id: editingAchievement.id } : a);
      setAchievements(updated);
      localStorage.setItem('achievements', JSON.stringify(updated));
    } else {
      const newAchievement = { ...achievementFormData, id: Date.now() };
      const updated = [...achievements, newAchievement];
      setAchievements(updated);
      localStorage.setItem('achievements', JSON.stringify(updated));
    }
    setShowModal(false);
    setEditingAchievement(null);
    setAchievementFormData({ title: '', description: '' });
    alert('Achievement saved!');
  };

  const stats = {
    totalProjects: projects.length,
    thesisCount: projects.filter(p => p.project_type === 'Thesis').length,
    capstoneCount: projects.filter(p => p.project_type === 'Capstone').length,
    researchCount: projects.filter(p => p.project_type === 'Research').length,
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
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.thesisCount}</div>
            <div style={{ opacity: 0.9 }}>Thesis Projects</div>
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
          <button onClick={() => setActiveTab('projects')} style={{ padding: '1rem 2rem', background: activeTab === 'projects' ? '#1e3a8a' : 'transparent', color: activeTab === 'projects' ? 'white' : '#64748b', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} />
            Projects
          </button>
          <button onClick={() => setActiveTab('achievements')} style={{ padding: '1rem 2rem', background: activeTab === 'achievements' ? '#1e3a8a' : 'transparent', color: activeTab === 'achievements' ? 'white' : '#64748b', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} />
            Achievements
          </button>
        </div>

        {/* Content */}
        {activeTab === 'projects' ? (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
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
                  ))}
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
                  <button onClick={() => { localStorage.setItem('missionVision', JSON.stringify(missionVision)); setEditingMissionVision(false); alert('Mission & Vision updated!'); }} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
                  <button onClick={() => setEditingMissionVision(false)} style={{ background: '#6b7280', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                </div>
              )}
            </div>
            
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '1rem' }}>All Achievements ({achievements.length})</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {achievements.map(achievement => (
                  <div key={achievement.id} style={{ background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
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
                        <option value="Thesis">Thesis</option>
                        <option value="Capstone">Capstone</option>
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

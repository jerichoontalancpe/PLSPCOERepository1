import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Eye, Users } from 'lucide-react';
import axios from 'axios';

const About = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/achievements`);
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="section-title">About the College of Engineering</h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#64748b', 
            maxWidth: '800px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Pamantasan ng Lungsod ng San Pablo - College of Engineering
          </p>
        </div>

        {/* College Logos */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          <div style={{
            padding: '1rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <img 
              src="/coe-logo.jpg" 
              alt="College of Engineering" 
              style={{ width: '120px', height: '120px', borderRadius: '8px' }}
            />
          </div>
          <div style={{
            padding: '1rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <img 
              src="/plsp-logo.jpg" 
              alt="PLSP" 
              style={{ width: '120px', height: '120px', borderRadius: '8px' }}
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#1e3a8a',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Target size={24} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e3a8a' }}>
                Mission
              </h2>
            </div>
            <div style={{ 
              lineHeight: '1.8', 
              color: '#64748b',
              fontStyle: 'italic',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '2px dashed #cbd5e1'
            }}>
              [Mission statement to be added by administrator]
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#f97316',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Eye size={24} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e3a8a' }}>
                Vision
              </h2>
            </div>
            <div style={{ 
              lineHeight: '1.8', 
              color: '#64748b',
              fontStyle: 'italic',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '2px dashed #cbd5e1'
            }}>
              [Vision statement to be added by administrator]
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '600', 
            color: '#1e3a8a',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Achievements & Recognition
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ color: '#64748b' }}>Loading achievements...</div>
            </div>
          ) : achievements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ color: '#64748b' }}>No achievements available</div>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {(achievements || []).map((achievement) => (
                <div key={achievement.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s'
                }}>
                  {achievement.image_filename && (
                    <img 
                      src={`/uploads/${achievement.image_filename}`} 
                      alt={achievement.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ color: '#1e3a8a', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                      {achievement.title}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Programs */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '600', 
            color: '#1e3a8a',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Engineering Programs
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#1e3a8a',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white'
              }}>
                <Users size={28} />
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1e3a8a',
                marginBottom: '1rem'
              }}>
                Industrial Engineering (BSIE)
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Focuses on optimizing complex processes, systems, and organizations 
                by integrating people, materials, information, equipment, and energy.
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#f97316',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white'
              }}>
                <BookOpen size={28} />
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1e3a8a',
                marginBottom: '1rem'
              }}>
                Computer Engineering (BSCpE)
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Combines electrical engineering and computer science to develop 
                computer systems and their components, including hardware and software.
              </p>
            </div>
          </div>
        </div>

        {/* Repository Purpose */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '600', 
            color: '#1e3a8a',
            marginBottom: '2rem'
          }}>
            Repository Purpose
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.8', 
            color: '#475569',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            This digital repository serves as a comprehensive archive of academic works 
            from our engineering students and faculty. It houses Methods of Research (MOR) 
            topics, completed capstone projects, design projects, and ongoing research 
            initiatives. The platform facilitates knowledge sharing, inspires future 
            research directions, and showcases the innovative work of our engineering 
            community to support continuous learning and academic excellence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

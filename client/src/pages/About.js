import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Eye, Users, Award, ArrowUp } from 'lucide-react';
import axios from 'axios';

const AchievementCard = ({ achievement }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLen = 120;
  const isLong = achievement.description && achievement.description.length > maxLen;

  return (
    <div style={{
      background: 'white', borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
    >
      {achievement.image_filename ? (
        <img src={achievement.image_filename} alt={achievement.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '220px', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Award size={48} style={{ color: 'rgba(255,255,255,0.5)' }} />
        </div>
      )}
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1e3a8a', fontSize: '0.75rem', fontWeight: '600', padding: '0.2rem 0.65rem', borderRadius: '20px', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Achievement
        </div>
        <h3 style={{ color: '#1e293b', marginBottom: '0.5rem', fontSize: '1.05rem', fontWeight: '600', lineHeight: '1.4' }}>{achievement.title}</h3>
        {achievement.description && (
          <>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {expanded || !isLong ? achievement.description : achievement.description.substring(0, maxLen) + '...'}
            </p>
            {isLong && (
              <button onClick={() => setExpanded(e => !e)} style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#f97316', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>
                {expanded ? 'Show Less ↑' : 'Read More ↓'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const About = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missionVision, setMissionVision] = useState({ mission: '', vision: '' });
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchData();
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchData = async () => {
    try {
      const [achievementsRes, settingsRes] = await Promise.all([
        axios.get('/api/achievements'),
        axios.get('/api/settings')
      ]);
      setAchievements(achievementsRes.data);
      const s = settingsRes.data || {};
      setMissionVision({ mission: s.mission || '', vision: s.vision || '' });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title">About the College of Engineering</h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Pamantasan ng Lungsod ng San Pablo - College of Engineering
          </p>
        </div>

        {/* College Logos */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {[{ src: '/coe-logo.jpg', alt: 'College of Engineering' }, { src: '/plsp-logo.jpg', alt: 'PLSP' }].map(logo => (
            <div key={logo.alt} style={{ padding: '1rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <img src={logo.src} alt={logo.alt} style={{ width: '120px', height: '120px', borderRadius: '8px', display: 'block' }} />
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {[
            { key: 'mission', label: 'Mission', icon: <Target size={24} />, color: '#1e3a8a' },
            { key: 'vision', label: 'Vision', icon: <Eye size={24} />, color: '#f97316' }
          ].map(({ key, label, icon, color }) => (
            <div key={key} style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', background: color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  {icon}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e3a8a' }}>{label}</h2>
              </div>
              <div style={{
                lineHeight: '1.8',
                color: missionVision[key] ? '#64748b' : '#94a3b8',
                fontStyle: missionVision[key] ? 'normal' : 'italic',
                padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'
              }}>
                {missionVision[key] || `${label} statement not yet added.`}
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '600', color: '#1e3a8a', textAlign: 'center', marginBottom: '2rem' }}>
            Achievements & Recognition
          </h2>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                  <div className="skeleton" style={{ height: '220px', borderRadius: 0 }} />
                  <div style={{ padding: '1.5rem' }}>
                    <div className="skeleton" style={{ height: '18px', width: '70%', marginBottom: '0.75rem' }} />
                    <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.4rem' }} />
                    <div className="skeleton" style={{ height: '14px', width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : achievements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No achievements available</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          )}
        </div>

        {/* Programs */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '600', color: '#1e3a8a', textAlign: 'center', marginBottom: '2rem' }}>
            Engineering Programs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <Users size={28} />, color: '#1e3a8a', title: 'Industrial Engineering (BSIE)', desc: 'Focuses on optimizing complex processes, systems, and organizations by integrating people, materials, information, equipment, and energy.' },
              { icon: <BookOpen size={28} />, color: '#f97316', title: 'Computer Engineering (BSCpE)', desc: 'Combines electrical engineering and computer science to develop computer systems and their components, including hardware and software.' }
            ].map(({ icon, color, title, desc }) => (
              <div key={title} style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white' }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '1rem' }}>{title}</h3>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Repository Purpose */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '2rem' }}>Repository Purpose</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#475569', maxWidth: '800px', margin: '0 auto' }}>
            This digital repository serves as a comprehensive archive of academic works from our engineering students and faculty.
            It houses Methods of Research (MOR) topics, completed capstone projects, design projects, and ongoing research initiatives.
            The platform facilitates knowledge sharing, inspires future research directions, and showcases the innovative work of our
            engineering community to support continuous learning and academic excellence.
          </p>
        </div>

      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

export default About;

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logos">
          <img src="/coe-logo.jpg" alt="College of Engineering" style={{ width: '55px', height: '55px', borderRadius: '8px' }} />
          <img src="/plsp-logo.jpg" alt="PLSP" style={{ width: '55px', height: '55px', borderRadius: '8px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'left', marginBottom: '2rem', maxWidth: '900px', margin: '0 auto 2rem' }}>
          <div>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: 'white' }}>Quick Links</div>
            <div className="footer-links" style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/repository/all">Repository</Link>
              <Link to="/admin/login">Admin</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: 'white' }}>Repository</div>
            <div className="footer-links" style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Link to="/repository/all?department=Computer Engineering">CPE Projects</Link>
              <Link to="/repository/all?department=Industrial Engineering">IE Projects</Link>
              <Link to="/repository/all?type=MOR">MOR Library</Link>
              <Link to="/repository/all?type=Capstone">Capstone Projects</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: 'white' }}>Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>
              <span style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                City of San Pablo, Laguna, Philippines
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} />
                coe@plsp.edu.ph
              </span>
              <a href="https://www.facebook.com/coe.plsp" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
                <Facebook size={16} />
                facebook.com/coe.plsp
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem' }}>
          <p>&copy; {new Date().getFullYear()} Pamantasan ng Lungsod ng San Pablo — College of Engineering</p>
          <p style={{ marginTop: '0.25rem' }}>Repository Management System</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logos">
          <img src="/coe-logo.jpg" alt="College of Engineering" style={{ width: '55px', height: '55px', borderRadius: '8px' }} />
          <img src="/plsp-logo.jpg" alt="PLSP" style={{ width: '55px', height: '55px', borderRadius: '8px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'left', marginBottom: '2rem', maxWidth: '900px', margin: '0 auto 2rem' }}>
          <div>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: 'white' }}>Quick Links</div>
            <div className="footer-links" style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/repository/all">Repository</Link>
              <Link to="/admin/login">Admin</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: 'white' }}>Repository</div>
            <div className="footer-links" style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Link to="/repository/all?department=Computer Engineering">CPE Projects</Link>
              <Link to="/repository/all?department=Industrial Engineering">IE Projects</Link>
              <Link to="/repository/all?type=MOR">MOR Library</Link>
              <Link to="/repository/all?type=Capstone">Capstone Projects</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: 'white' }}>Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>
              <span style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                City of San Pablo, Laguna, Philippines
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} />
                coe@plsp.edu.ph
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} />
                (049) 562-0110
              </span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem' }}>
          <p>&copy; {new Date().getFullYear()} Pamantasan ng Lungsod ng San Pablo — College of Engineering</p>
          <p style={{ marginTop: '0.25rem' }}>Repository Management System</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

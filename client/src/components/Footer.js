import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logos">
          <img src="/coe-logo.jpg" alt="College of Engineering" style={{ width: '55px', height: '55px', borderRadius: '8px' }} />
          <img src="/plsp-logo.jpg" alt="PLSP" style={{ width: '55px', height: '55px', borderRadius: '8px' }} />
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/repository/all">Repository</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Pamantasan ng Lungsod ng San Pablo — College of Engineering</p>
        <p>Repository Management System</p>
      </div>
    </footer>
  );
};

export default Footer;

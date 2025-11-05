import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logos">
          <img 
            src="/coe-logo.jpg" 
            alt="College of Engineering" 
            style={{ width: '60px', height: '60px', borderRadius: '8px' }}
          />
          <img 
            src="/plsp-logo.jpg" 
            alt="PLSP" 
            style={{ width: '60px', height: '60px', borderRadius: '8px' }}
          />
        </div>
        <p>&copy; 2025 Pamantasan ng Lungsod ng San Pablo - College of Engineering</p>
        <p>Repository Management System</p>
      </div>
    </footer>
  );
};

export default Footer;

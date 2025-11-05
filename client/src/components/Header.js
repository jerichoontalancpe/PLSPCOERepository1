import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <img 
            src="/coe-logo.jpg" 
            alt="College of Engineering" 
            style={{ width: '50px', height: '50px', borderRadius: '8px' }}
          />
          <div>
            <div className="header-title">COE Repository System</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Pamantasan ng Lungsod ng San Pablo
            </div>
          </div>
          <img 
            src="/plsp-logo.jpg" 
            alt="PLSP" 
            style={{ width: '50px', height: '50px', borderRadius: '8px' }}
          />
        </div>
        
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            {user ? (
              <>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li>
                  <button 
                    onClick={handleLogout}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'white', 
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li><Link to="/admin/login">Admin</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

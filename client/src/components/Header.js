import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <img src="/coe-logo.jpg" alt="College of Engineering" style={{ width: '50px', height: '50px', borderRadius: '8px' }} />
          <div>
            <div className="header-title">COE Repository System</div>
            <div className="header-subtitle">Pamantasan ng Lungsod ng San Pablo</div>
          </div>
          <img src="/plsp-logo.jpg" alt="PLSP" style={{ width: '50px', height: '50px', borderRadius: '8px' }} />
        </div>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          className="hamburger-btn"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <nav className={`nav-wrapper${menuOpen ? ' nav-open' : ''}`}>
          <ul className="nav-links" onClick={closeMenu}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/repository/all">Repository</Link></li>
            {user ? (
              <>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>
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

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  const navClass = ({ isActive }) => isActive ? 'active' : undefined;

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

        <button onClick={() => setMenuOpen(o => !o)} style={{ display: 'none', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} className="hamburger-btn" aria-label="Toggle menu">
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <nav className={`nav-wrapper${menuOpen ? ' nav-open' : ''}`}>
          <ul className="nav-links" onClick={closeMenu}>
            <li><NavLink to="/" end className={navClass}>Home</NavLink></li>
            <li><NavLink to="/about" className={navClass}>About</NavLink></li>
            <li><NavLink to="/repository/all" className={navClass}>Repository</NavLink></li>
            {user ? (
              <>
                <li><NavLink to="/admin/dashboard" className={navClass}>Dashboard</NavLink></li>
                <li>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500', padding: 0, lineHeight: 'inherit', verticalAlign: 'middle' }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li><NavLink to="/admin/login" className={navClass}>Admin</NavLink></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

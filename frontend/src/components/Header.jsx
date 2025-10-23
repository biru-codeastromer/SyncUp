import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    await signOut();
    setIsProfileOpen(false);
    navigate('/login');
  };

  // Get user display data
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const userAvatar = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=fff&size=150`;

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/feed" className="brand-link">
            <div className="brand-logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 8 L16 24 M8 16 L24 16" stroke="currentColor" strokeWidth="2"/>
                <circle cx="16" cy="16" r="4" fill="currentColor"/>
              </svg>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">SyncUp</h1>
              <span className="brand-subtitle">Campus Clubs</span>
            </div>
          </Link>
        </div>

        <div className="header-center">
          <div className="header-search">
            <i className="ri-search-line search-icon"></i>
            <input 
              type="text" 
              placeholder="Search clubs, events, and people..." 
              className="search-input"
            />
          </div>
        </div>

        <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/feed" className="nav-link">
                <span className="nav-icon">📱</span>
                <span>Feed</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/clubs" className="nav-link">
                <span className="nav-icon">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCg8Ey4i_89l7PlDEpdkQHaieSu4NzApKkMRh964V3oBfGMeST9DJZccypScDDqUNLDEk&usqp=CAU"
                    alt="Discover"
                    className="w-5 h-5 color-white"
                  />
                </span>
                <span>Discover</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/events" className="nav-link">
                <span className="nav-icon">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNFlsqCnDVNql4ymcIUSLYOjWUnAB1RTq2Wg&s"
                    alt="Events"
                    className="w-5 h-5"
                  />
                </span>
                <span>Events</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                <span className="nav-icon">👤</span>
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-auth">
          {user ? (
            <div className="user-profile-wrapper">
              <button className="user-profile-btn" onClick={toggleProfile}>
                <img src={userAvatar} alt={userName} className="user-avatar" />
                <span className="user-name">{userName}</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className={`dropdown-arrow ${isProfileOpen ? 'open' : ''}`}
                >
                  <path d="M4 6 L8 10 L12 6"/>
                </svg>
              </button>
              
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <img src={userAvatar} alt={userName} className="dropdown-avatar" />
                    <div className="dropdown-user-info">
                      <p className="dropdown-name">{userName}</p>
                      <p className="dropdown-email">{userEmail}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <i className="ri-user-line"></i>
                    <span>My Profile</span>
                  </Link>
                  <Link to="/profile/edit" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <i className="ri-settings-3-line"></i>
                    <span>Edit Profile</span>
                  </Link>
                  <Link to="/clubs" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <i className="ri-group-line"></i>
                    <span>My Clubs</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <i className="ri-logout-box-line"></i>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="auth-link login-link">
                <span>Login</span>
              </Link>
              <Link to="/signup" className="auth-link signup-link">
                <span>Sign Up</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 12 L10 8 L6 4"/>
                </svg>
              </Link>
            </>
          )}
        </div>

        <button
          className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

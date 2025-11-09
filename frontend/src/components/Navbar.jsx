import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">SyncUp</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard">Feed</Link>
        <Link to="/clubs">Clubs</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={logout} className="navbar-logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
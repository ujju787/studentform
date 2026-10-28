import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, LayoutDashboard, UserCheck } from 'lucide-react';
import { getAuthToken, clearAuth, getStoredStudent } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const token = getAuthToken();
  const student = getStoredStudent();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>
          <span className="brand-name">EduPortal</span>
        </Link>

        <nav className="nav-links">
          {token ? (
            <div className="nav-user-section">
              <Link to="/dashboard" className="nav-link">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              {student && (
                <div className="user-badge" title={student.email}>
                  <UserCheck size={16} />
                  <span>{student.name}</span>
                </div>
              )}
              <button onClick={handleLogout} className="btn-logout" title="Log Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

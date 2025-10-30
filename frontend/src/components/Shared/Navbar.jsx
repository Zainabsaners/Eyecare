import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css'; // We'll create this CSS file

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="navbar-logo">
            👁️ EyeCare Vision AI
          </Link>
          <div className="navbar-loading">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            👁️ EyeCare Vision AI
          </Link>
          
          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            <Link to="/" className="navbar-link">
              🏠 Home
            </Link>
            <Link to="/awareness" className="navbar-link">
              📚 Awareness
            </Link>
            <Link to="/contact" className="navbar-link">
              📞 Contact
            </Link>
            
            {user ? (
              <>
                {/* Specialist Links */}
                {user.user_type === 'specialist' ? (
                  <>
                    <Link to="/specialist/consultations" className="navbar-link">
                      👨‍⚕️ My Consultations
                    </Link>
                    <Link to="/specialist/dashboard" className="navbar-link">
                      📊 Dashboard
                    </Link>
                  </>
                ) : user.user_type === 'patient' || user.user_type === 'user' ? (
                  // Patient/User Links
                  <>
                    <Link to="/scan" className="navbar-link">
                      🔍 Eye Scan
                    </Link>
                    <Link to="/scan-history" className="navbar-link">
                      📊 My Scans
                    </Link>
                    <Link to="/consultations" className="navbar-link">
                      👨‍⚕️ Consultations
                    </Link>
                  </>
                ) : user.user_type === 'admin' ? (
                  // Admin Links
                  <Link to="/admin" className="navbar-link">
                    ⚙️ Admin Panel
                  </Link>
                ) : null}

                <span className="navbar-greeting">
                  👋 Hello, {user.first_name || user.username}
                </span>
                <button 
                  onClick={handleLogout} 
                  className="navbar-logout-btn"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              // Guest Links
              <>
                <Link to="/login" className="navbar-link">
                  🔑 Login
                </Link>
                <Link to="/register" className="navbar-register-btn">
                  📝 Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="navbar-mobile-btn"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="navbar-mobile">
            <div className="navbar-mobile-content">
              <Link to="/" className="navbar-mobile-link" onClick={closeMobileMenu}>
                🏠 Home
              </Link>
              <Link to="/awareness" className="navbar-mobile-link" onClick={closeMobileMenu}>
                📚 Awareness
              </Link>
              <Link to="/contact" className="navbar-mobile-link" onClick={closeMobileMenu}>
                📞 Contact
              </Link>
              
              {user ? (
                <>
                  {/* Specialist Mobile Links */}
                  {user.user_type === 'specialist' ? (
                    <>
                      <Link 
                        to="/specialist/consultations" 
                        className="navbar-mobile-link"
                        onClick={closeMobileMenu}
                      >
                        👨‍⚕️ My Consultations
                      </Link>
                      <Link 
                        to="/specialist/dashboard" 
                        className="navbar-mobile-link"
                        onClick={closeMobileMenu}
                      >
                        📊 Dashboard
                      </Link>
                    </>
                  ) : user.user_type === 'patient' || user.user_type === 'user' ? (
                    // Patient/User Mobile Links
                    <>
                      <Link 
                        to="/scan" 
                        className="navbar-mobile-link"
                        onClick={closeMobileMenu}
                      >
                        🔍 Eye Scan
                      </Link>
                      <Link 
                        to="/scan-history" 
                        className="navbar-mobile-link"
                        onClick={closeMobileMenu}
                      >
                        📊 My Scans
                      </Link>
                      <Link 
                        to="/consultations" 
                        className="navbar-mobile-link"
                        onClick={closeMobileMenu}
                      >
                        👨‍⚕️ Consultations
                      </Link>
                    </>
                  ) : user.user_type === 'admin' ? (
                    // Admin Mobile Links
                    <Link 
                      to="/admin" 
                      className="navbar-mobile-link"
                      onClick={closeMobileMenu}
                    >
                      ⚙️ Admin Panel
                    </Link>
                  ) : null}

                  <div className="navbar-mobile-greeting">
                    👋 Hello, {user.first_name || user.username}
                  </div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="navbar-mobile-logout"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                // Guest Mobile Links
                <>
                  <Link 
                    to="/login" 
                    className="navbar-mobile-link navbar-mobile-login"
                    onClick={closeMobileMenu}
                  >
                    🔑 Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="navbar-mobile-register"
                    onClick={closeMobileMenu}
                  >
                    📝 Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div style={{ height: '80px' }}></div>
    </>
  );
};

export default Navbar;
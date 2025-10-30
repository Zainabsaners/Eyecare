import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const phoneNumber = '0702640917';
  const whatsappMessage = "Hello! I'm interested in EyeCare Vision AI services. Can you provide more information?";
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/254702640917?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer style={{
      background: '#2c3e50',
      color: 'white',
      padding: '3rem 0 1rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Company Info */}
          <div>
            <h3 style={{ color: '#4CAF50', marginBottom: '1rem', fontSize: '1.5rem' }}>
              👁️ EyeCare Vision AI
            </h3>
            <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
              Advanced AI-powered eye care platform for early detection, analysis, 
              and specialist connection. Making eye care accessible to everyone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={handleWhatsAppClick}
                style={{
                  background: '#25D366',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem'
                }}
              >
                💬 Chat on WhatsApp
              </button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#4CAF50' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/" style={{ color: '#bdc3c7', textDecoration: 'none', transition: 'color 0.3s' }}>
                  🏠 Home
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/scan" style={{ color: '#bdc3c7', textDecoration: 'none', transition: 'color 0.3s' }}>
                  🔍 Eye Scan
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/scan-history" style={{ color: '#bdc3c7', textDecoration: 'none', transition: 'color 0.3s' }}>
                  📊 My Scans
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/consultations" style={{ color: '#bdc3c7', textDecoration: 'none', transition: 'color 0.3s' }}>
                  👨‍⚕️ Consultations
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/articles" style={{ color: '#bdc3c7', textDecoration: 'none', transition: 'color 0.3s' }}>
                  📚 Eye Health Tips
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#4CAF50' }}>Our Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#bdc3c7' }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🤖 AI Eye Analysis
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                👨‍⚕️ Specialist Consultations
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📊 Scan History Tracking
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                💡 Eye Health Education
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🏥 Remote Diagnosis
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#4CAF50' }}>Contact Info</h4>
            <div style={{ color: '#bdc3c7' }}>
              <p style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🏢 Achievers WiSTEM MMUST, Kenya
              </p>
              <p 
                style={{ 
                  marginBottom: '0.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
                onClick={handleWhatsAppClick}
              >
                📞 +254 702640917
              </p>
              <p style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ✉️ info@eyecare.ai
              </p>
              <p style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🕒 Mon - Fri: 8:00 AM - 6:00 PM
              </p>
            </div>
            
            {/* Emergency Contact */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '1rem', 
              borderRadius: '5px', 
              marginTop: '1rem',
              border: '1px solid #4CAF50'
            }}>
              <h5 style={{ color: '#4CAF50', marginBottom: '0.5rem' }}>🚨 Emergency?</h5>
              <p style={{ fontSize: '0.9rem', margin: 0, color: '#bdc3c7' }}>
                For urgent eye care issues, contact us immediately via WhatsApp for quick assistance.
              </p>
            </div>
          </div>
        </div>
        
        {/* Social Links & Additional Info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #34495e',
          paddingTop: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ color: '#bdc3c7' }}>
            <p style={{ margin: 0 }}>&copy; 2025 Achievers EyeCare Vision AI. All rights reserved.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#bdc3c7', fontSize: '0.9rem' }}>Follow us:</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href="#" style={{ color: '#bdc3c7', textDecoration: 'none' }}>📘</a>
              <a href="#" style={{ color: '#bdc3c7', textDecoration: 'none' }}>🐦</a>
              <a href="#" style={{ color: '#bdc3c7', textDecoration: 'none' }}>📷</a>
              <a href="#" style={{ color: '#bdc3c7', textDecoration: 'none' }}>💼</a>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#bdc3c7' }}>
            <a href="#" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Contact Support</a>
          </div>
        </div>
        
        {/* Trust Badges */}
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #34495e',
          color: '#bdc3c7',
          fontSize: '0.8rem'
        }}>
          <p style={{ margin: 0 }}>
            🔒 Secure & Confidential • 🏥 Medical Grade Analysis • 🤖 AI-Powered Technology
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
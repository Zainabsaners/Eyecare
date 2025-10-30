import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // We'll create this CSS file

const Home = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Upload eye images for instant AI analysis and early detection of common eye conditions with 98% accuracy.',
      features: ['Instant Results', 'High Accuracy', '24/7 Available']
    },
    {
      icon: '👨‍⚕️',
      title: 'Specialist Connection',
      description: 'Connect with verified eye care specialists for consultations, follow-up care, and personalized treatment plans.',
      features: ['Verified Specialists', 'Quick Appointments', 'Remote Consultations']
    },
    {
      icon: '📚',
      title: 'Eye Health Education',
      description: 'Access comprehensive resources about eye care, prevention, treatment options, and healthy habits.',
      features: ['Expert Articles', 'Prevention Tips', 'Treatment Guides']
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your eye health journey with detailed scan history and progress reports over time.',
      features: ['Scan History', 'Progress Reports', 'Health Trends']
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your health data is protected with enterprise-grade security and complete privacy controls.',
      features: ['Data Encryption', 'HIPAA Compliant', 'Private Records']
    },
    {
      icon: '🌍',
      title: 'Lake Basin Focus',
      description: 'Specialized care for communities in the Lake Basin Region with local specialist networks.',
      features: ['Local Specialists', 'Community Focus', 'Regional Support']
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-title">
                Early Eye Problem Detection with{' '}
                <span className="hero-highlight">AI</span>
              </h1>
              <p className="hero-description">
                Protect your vision with our advanced AI-powered eye care platform. 
                Get instant analysis, connect with specialists in the Lake Basin Region, 
                and take control of your eye health journey.
              </p>
              <div className="hero-buttons">
                <Link to="/scan" className="btn btn-primary hero-btn">
                  🔍 Start Eye Scan
                </Link>
                <Link to="/register" className="btn btn-secondary hero-btn">
                  🚀 Get Started
                </Link>
              </div>

              {/* Stats Section */}
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Scans Analyzed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Specialists</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Accuracy</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image/Illustration */}
            <div className="hero-illustration">
              <div className="hero-card">
                <div className="hero-icon">👁️‍🗨️</div>
                <h3>AI Vision Analysis</h3>
                <p>Advanced machine learning for accurate eye health assessment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="features-title">
            How EyeCare Vision AI Helps You
          </h2>
          <p className="features-subtitle">
            Our comprehensive platform combines cutting-edge AI technology with expert care 
            to revolutionize eye health monitoring.
          </p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">
                  {feature.description}
                </p>
                <div className="feature-tags">
                  {feature.features.map((item, idx) => (
                    <span key={idx} className="feature-tag">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">
            Ready to Protect Your Vision?
          </h2>
          <p className="cta-description">
            Join thousands of users who trust EyeCare Vision AI for their eye health monitoring. 
            Start your journey to better vision today.
          </p>
          <div className="cta-buttons">
            <Link to="/scan" className="btn btn-primary cta-btn">
              🔍 Start Free Scan
            </Link>
            <Link to="/articles" className="btn btn-secondary cta-btn">
              📚 Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
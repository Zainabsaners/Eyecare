import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Pre-fill form if user is logged in
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/contact/contact-messages/', formData,{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess(response.data.message || 'Thank you for your message! Our team will get back to you soon.');
      setFormData({
        name: user ? `${user.first_name} ${user.last_name}` : '',
        email: user ? user.email || '' : '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error.response?.data) {
        // Handle validation errors
        const errors = error.response.data;
        if (typeof errors === 'object') {
          errorMessage = Object.values(errors).flat().join(' ');
        } else {
          errorMessage = errors;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'start'
      }}>
        {/* Contact Information */}
        <div>
          <h1 style={{ marginBottom: '1rem', color: '#333' }}>Contact Us</h1>
          <p style={{ marginBottom: '2rem', color: '#666', fontSize: '1.1rem' }}>
            Have questions about our services? Get in touch with our team of specialists and admins.
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>��� Our Location</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Lake Basin Region, Kenya<br />
              Kisumu City
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>��� Contact Information</h3>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              <strong>Phone:</strong> +254 700 000 000
            </p>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              <strong>Email:</strong> info@eyecare.ai
            </p>
            <p style={{ color: '#666' }}>
              <strong>Hours:</strong> Mon-Fri 8:00 AM - 5:00 PM
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>��� Who Will Help You?</h3>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              <strong>Specialists:</strong> Ophthalmologists and eye care experts
            </p>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              <strong>Admins:</strong> Platform support and general inquiries
            </p>
            <p style={{ color: '#666' }}>
              <strong>Response Time:</strong> Typically within 24 hours
            </p>
          </div>

          <div>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>��� Need Immediate Help?</h3>
            <p style={{ color: '#666' }}>
              For urgent eye care concerns, please visit your nearest healthcare facility 
              or contact emergency services.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Send us a Message</h2>
          
          {success && (
            <div style={{
              background: '#d4edda',
              color: '#155724',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid #c3e6cb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <div>
                  <strong>Message Sent Successfully!</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{success}</div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid #f5c6cb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>❌</span>
                <div>
                  <strong>Error Sending Message</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{error}</div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={2}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={5}
                placeholder="Brief description of your inquiry"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={10}
                rows="6"
                placeholder="Please provide details about your inquiry, questions, or concerns..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical',
                  transition: 'border-color 0.3s ease',
                  minHeight: '120px'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ 
                width: '100%',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div className="loading-spinner"></div>
                  Sending Message...
                </div>
              ) : (
                'Send Message to Our Team'
              )}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#666'
          }}>
            <strong>Note:</strong> Your message will be received by our team of specialists and administrators. 
            We typically respond within 24 hours during business days.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

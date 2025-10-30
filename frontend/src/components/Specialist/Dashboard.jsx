import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SpecialistDashboard = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/consultations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConsultations(data);
      } else {
        setError('Failed to fetch consultations');
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError('Error loading consultations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'approved': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#666';
    }
  };

  // Calculate stats
  const pendingConsultations = consultations.filter(c => c.status === 'pending').length;
  const approvedConsultations = consultations.filter(c => c.status === 'approved').length;
  const completedConsultations = consultations.filter(c => c.status === 'completed').length;

  if (!user || user.user_type !== 'specialist') {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2>Access Denied</h2>
          <p>This page is only accessible to specialists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#333', margin: 0 }}>Specialist Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/specialist/consultations" className="btn btn-primary">
            👨‍⚕️ Manage All Consultations
          </Link>
        </div>
      </div>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          {error}
        </div>
      )}

      {/* Dashboard Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Total Consultations</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>{consultations.length}</div>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Pending Review</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF9800' }}>{pendingConsultations}</div>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Approved</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2196F3' }}>{approvedConsultations}</div>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Completed</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>{completedConsultations}</div>
        </div>
      </div>

      {/* Recent Consultation Requests */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#333', margin: 0 }}>Recent Consultation Requests</h2>
          <Link to="/specialist/consultations" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: '500' }}>
            View All →
          </Link>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading consultations...</p>
          </div>
        ) : consultations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <h3>No Consultation Requests Yet</h3>
            <p>When patients request consultations with you, they will appear here.</p>
            <p style={{ marginTop: '1rem' }}>Patients can find you in the specialist list when requesting consultations.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {consultations.slice(0, 5).map((consultation) => (
              <div key={consultation.id} style={{
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                padding: '1.5rem',
                background: '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                      Consultation #{consultation.id}
                    </h3>
                    <p style={{ margin: '0', color: '#666' }}>
                      Patient: <strong>{consultation.user_name || 'Unknown Patient'}</strong>
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      Description: {consultation.description}
                    </p>
                    {consultation.scheduled_date && (
                      <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                        Preferred: {new Date(consultation.scheduled_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div style={{
                    background: getStatusColor(consultation.status),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {consultation.status}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link 
                    to="/specialist/consultations" 
                    className="btn"
                    style={{ 
                      background: '#4CAF50', 
                      color: 'white', 
                      textDecoration: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
            
            {consultations.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/specialist/consultations" className="btn" style={{ 
                  background: 'transparent', 
                  color: '#4CAF50', 
                  textDecoration: 'none',
                  border: '1px solid #4CAF50'
                }}>
                  View All {consultations.length} Consultations
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#e7f3ff',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #b3d9ff',
        marginTop: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/specialist/consultations" className="btn btn-primary">
            👨‍⚕️ Manage Consultations
          </Link>
          <Link to="/scan-history" className="btn" style={{ 
            background: 'white', 
            color: '#333',
            border: '1px solid #ddd'
          }}>
            📊 View All Scans
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboard;
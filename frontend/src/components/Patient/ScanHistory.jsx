import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';
import { Add, MedicalServices, Visibility } from '@mui/icons-material';

const ScanHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await axios.get('/scans/');
      if (Array.isArray(response.data)) {
        setScans(response.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        setScans(response.data.results);
      } else {
        setScans([]);
      }
    } catch (error) {
      console.error('Error fetching scans:', error);
      setError('Failed to load scan history.');
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition) => {
    const colors = {
      normal: '#4CAF50',
      redness: '#FF9800',
      dryness: '#2196F3',
      cataract: '#9C27B0',
      glaucoma: '#F44336',
      conjunctivitis: '#FF5722'
    };
    return colors[condition] || '#666';
  };

  const viewScanDetails = (scan) => {
    navigate('/results', { state: { scanResult: scan } });
  };

  const handleRequestConsultation = (scanId) => {
    navigate('/consultations', { 
      state: { 
        preselectedScan: scanId 
      } 
    });
  };

  const handleGeneralConsultation = () => {
    navigate('/consultations');
  };

  if (!user || user.user_type !== 'user') {
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
          <p>This page is only accessible to patients.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>My Scan History</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<MedicalServices />}
            onClick={handleGeneralConsultation}
            style={{ backgroundColor: '#1976d2' }}
          >
            Request Consultation
          </Button>
          <button 
            onClick={() => navigate('/scan')}
            className="btn btn-primary"
          >
            + New Scan
          </button>
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

      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading your scan history...</p>
          </div>
        ) : scans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <h3>No Scans Yet</h3>
            <p>You haven't uploaded any eye scans yet.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<MedicalServices />}
                onClick={handleGeneralConsultation}
                style={{ backgroundColor: '#1976d2' }}
              >
                Request General Consultation
              </Button>
              <button 
                onClick={() => navigate('/scan')}
                className="btn btn-primary"
              >
                Upload Your First Scan
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {scans.map((scan) => (
              <div key={scan.id} style={{
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                padding: '1.5rem',
                background: scan.is_reviewed ? '#f8fff9' : '#fff',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                      Scan #{scan.id}
                    </h3>
                    <p style={{ margin: '0', color: '#666' }}>
                      Condition: <strong style={{ color: getConditionColor(scan.condition_detected) }}>
                        {scan.condition_detected}
                      </strong> 
                      ({(scan.confidence_score * 100).toFixed(1)}% confidence)
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      Uploaded: {new Date(scan.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div style={{
                    background: scan.is_reviewed ? '#4CAF50' : '#FF9800',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {scan.is_reviewed ? 'Reviewed by Specialist' : 'Pending Review'}
                  </div>
                </div>

                {scan.is_reviewed && scan.scanreview && (
                  <div style={{
                    background: '#e8f5e8',
                    padding: '1rem',
                    borderRadius: '6px',
                    marginTop: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>👨‍⚕️</span>
                      <strong style={{ color: '#2e7d32' }}>Specialist Review Available</strong>
                    </div>
                    <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
                      Click to view detailed diagnosis and recommendations from our specialist.
                    </p>
                  </div>
                )}

                {/* Consultation Button Section */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'flex-end',
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: '1rem',
                  marginTop: '1rem'
                }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => viewScanDetails(scan)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<MedicalServices />}
                    onClick={() => handleRequestConsultation(scan.id)}
                    style={{ backgroundColor: '#1976d2' }}
                  >
                    Consult Specialist
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Section */}
      {scans.length > 0 && (
        <div style={{
          background: '#e7f3ff',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #b3d9ff',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <MedicalServices /> Need Professional Advice?
          </h3>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Discuss any of your scans with our eye specialists for personalized recommendations and treatment plans.
          </p>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleGeneralConsultation}
            style={{ backgroundColor: '#1976d2', padding: '10px 24px' }}
          >
            Request New Consultation
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScanHistory;

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const scanResult = location.state?.scanResult;

  if (!scanResult) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          No scan results found. Please perform a scan first.
        </div>
      </div>
    );
  }

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

  const getSeverityLevel = (confidence, condition) => {
    if (condition === 'normal') return 'Low';
    if (confidence > 0.85) return 'High';
    if (confidence > 0.75) return 'Medium';
    return 'Low';
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Scan Results
        </h2>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            background: getConditionColor(scanResult.condition_detected),
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            {scanResult.condition_detected.toUpperCase()}
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            alignItems: 'center'
          }}>
            <div style={{ fontWeight: 'bold', color: '#666' }}>
              Confidence: {(scanResult.confidence_score * 100).toFixed(1)}%
            </div>
            <div style={{
              background: '#e3f2fd',
              color: '#1976d2',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Severity: {getSeverityLevel(scanResult.confidence_score, scanResult.condition_detected)}
            </div>
          </div>
        </div>

        {/* Scan Image */}
        {scanResult.image && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1rem', color: '#333', textAlign: 'left' }}>Your Eye Scan</h4>
            <img 
              src={`http://localhost:8000${scanResult.image}`} 
              alt="Eye scan" 
              style={{ 
                maxWidth: '300px', 
                maxHeight: '250px',
                borderRadius: '8px',
                border: '1px solid #e1e5e9'
              }} 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* AI Analysis Section */}
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            borderLeft: `4px solid ${getConditionColor(scanResult.condition_detected)}`
          }}>
            <h4 style={{ marginBottom: '1rem', color: '#333' }}>🤖 AI Analysis</h4>
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ marginBottom: '0.5rem', color: '#666' }}>Condition Detected</h5>
              <p style={{ 
                fontSize: '1.1rem', 
                fontWeight: '500',
                color: getConditionColor(scanResult.condition_detected),
                margin: 0
              }}>
                {scanResult.condition_detected}
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ marginBottom: '0.5rem', color: '#666' }}>AI Recommendations</h5>
              <p style={{ lineHeight: '1.6', color: '#666', margin: 0 }}>
                {scanResult.recommendations}
              </p>
            </div>
          </div>

          {/* Specialist Review Section */}
          {scanResult.is_reviewed && scanResult.scanreview && (
            <div style={{
              background: '#e8f5e8',
              padding: '1.5rem',
              borderRadius: '8px',
              borderLeft: '4px solid #4CAF50'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>👨‍⚕️</span>
                <h4 style={{ margin: 0, color: '#333' }}>Specialist Review</h4>
                <span style={{
                  background: '#4CAF50',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  marginLeft: 'auto'
                }}>
                  Reviewed
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h5 style={{ marginBottom: '0.5rem', color: '#666' }}>Professional Diagnosis</h5>
                <div style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #d1e7dd'
                }}>
                  <p style={{ lineHeight: '1.6', color: '#333', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {scanResult.scanreview.diagnosis}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h5 style={{ marginBottom: '0.5rem', color: '#666' }}>Treatment Recommendations</h5>
                <div style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #d1e7dd'
                }}>
                  <p style={{ lineHeight: '1.6', color: '#333', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {scanResult.scanreview.recommendations}
                  </p>
                </div>
              </div>

              {scanResult.scanreview.specialist_name && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #c8e6c9',
                  paddingTop: '1rem',
                  color: '#666',
                  fontSize: '0.875rem'
                }}>
                  <span>Reviewed by: <strong>{scanResult.scanreview.specialist_name}</strong></span>
                  <span>
                    {new Date(scanResult.scanreview.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Pending Review Notice */}
          {scanResult.is_reviewed === false && (
            <div style={{
              background: '#fff3cd',
              padding: '1.5rem',
              borderRadius: '8px',
              borderLeft: '4px solid #ffc107',
              textAlign: 'center'
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#856404' }}>⏳ Pending Specialist Review</h4>
              <p style={{ color: '#856404', margin: 0 }}>
                Your scan has been submitted for professional review. A specialist will examine your results 
                and provide their diagnosis and recommendations soon.
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/scan')}
            className="btn"
            style={{ 
              background: '#6c757d', 
              color: 'white'
            }}
          >
            New Scan
          </button>
          
          {user?.user_type === 'user' && !scanResult.is_reviewed && (
            <button 
              onClick={() => navigate('/consultations', { state: { scanResult }})}
              className="btn btn-primary"
            >
              Request Specialist Consultation
            </button>
          )}
          
          <button 
            onClick={() => navigate('/awareness')}
            className="btn"
            style={{ 
              background: '#17a2b8', 
              color: 'white'
            }}
          >
            Learn More About Eye Health
          </button>
        </div>

        <div style={{
          background: '#e7f3ff',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #b3d9ff',
          marginTop: '2rem'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#0066cc', margin: 0 }}>
            <strong>Disclaimer:</strong> This AI analysis is for preliminary screening only. 
            Always consult with a qualified healthcare professional for proper diagnosis and treatment.
            {scanResult.is_reviewed && " The specialist review above provides professional medical advice."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;

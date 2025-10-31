import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Scan = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Please login again. Authentication token missing.');
        setLoading(false);
        return;
      }

      const response = await axios.post('/scans/scans/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      navigate('/results', { state: { scanResult: response.data } });
    } catch (error) {
      console.error('Scan upload error:', error);
      
      // Better error handling
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (error.response?.status === 405) {
        setError('Scan endpoint not configured properly. Please contact support.');
      } else if (error.response?.data) {
        setError(error.response.data.detail || 'Scan failed. Please try again.');
      } else {
        setError('Scan failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ffeaa7'
        }}>
          <h2>Authentication Required</h2>
          <p>Please login to use the eye scan feature.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>
          Eye Scan Analysis
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
          Upload a clear image of your eye for AI analysis
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{
            border: '2px dashed #e1e5e9',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '2rem',
            cursor: 'pointer'
          }}>
            <input
              type="file"
              id="eye-image"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <label htmlFor="eye-image" style={{ cursor: 'pointer' }}>
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Eye preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px', 
                    borderRadius: '8px' 
                  }} 
                />
              ) : (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                  <p>Click to upload eye image</p>
                </div>
              )}
            </label>
          </div>
          
          {error && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '12px',
              borderRadius: '6px',
              margin: '15px 0',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={!selectedFile || loading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Analyzing...' : 'Start Analysis'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '1rem' }}>💡 Tips for best results:</h4>
          <ul style={{ textAlign: 'left', color: '#666' }}>
            <li>Use good lighting</li>
            <li>Ensure the eye is clearly visible</li>
            <li>Take photo from front angle</li>
            <li>Avoid blurry images</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Scan;
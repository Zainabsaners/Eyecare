
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Awareness = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/articles/');
      if (Array.isArray(response.data)) {
        setArticles(response.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        setArticles(response.data.results);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      prevention: '#4CAF50',
      symptoms: '#FF9800',
      treatment: '#2196F3',
      general: '#9C27B0'
    };
    return colors[category] || '#666';
  };

  const getCategoryName = (category) => {
    const names = {
      prevention: 'Prevention Tips',
      symptoms: 'Early Symptoms',
      treatment: 'Treatment Options',
      general: 'General Eye Care'
    };
    return names[category] || category;
  };

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.category === filter);

  const categories = [
    { value: 'all', label: 'All Topics', count: articles.length },
    { value: 'prevention', label: 'Prevention Tips', count: articles.filter(a => a.category === 'prevention').length },
    { value: 'symptoms', label: 'Early Symptoms', count: articles.filter(a => a.category === 'symptoms').length },
    { value: 'treatment', label: 'Treatment Options', count: articles.filter(a => a.category === 'treatment').length },
    { value: 'general', label: 'General Eye Care', count: articles.filter(a => a.category === 'general').length }
  ];

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '1rem', color: '#333' }}>Eye Health Awareness</h1>
        <p style={{ marginBottom: '2rem', color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Comprehensive resources about eye care, prevention, symptoms, and treatment options. 
          Stay informed and protect your vision.
        </p>
      </div>

      {/* Category Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setFilter(category.value)}
            style={{
              background: filter === category.value ? getCategoryColor(category.value === 'all' ? 'general' : category.value) : 'white',
              color: filter === category.value ? 'white' : '#333',
              border: `2px solid ${getCategoryColor(category.value === 'all' ? 'general' : category.value)}`,
              padding: '0.75rem 1.5rem',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {category.label}
            <span style={{
              background: filter === category.value ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
              color: filter === category.value ? 'white' : '#666',
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👁️</div>
          <p>Loading educational content...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem',
          background: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>
            {filter === 'all' ? 'No Articles Available' : `No ${getCategoryName(filter)} Articles`}
          </h3>
          <p style={{ color: '#999', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            {filter === 'all' 
              ? 'Our team is preparing comprehensive eye health content. Please check back soon for educational articles.'
              : `We're working on more content about ${getCategoryName(filter).toLowerCase()}. Check other categories for available articles.`
            }
          </p>
          {filter !== 'all' && (
            <button 
              onClick={() => setFilter('all')}
              className="btn btn-primary"
            >
              View All Available Articles
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {filteredArticles.map((article) => (
            <div key={article.id} style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderLeft: `4px solid ${getCategoryColor(article.category)}`
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <h2 style={{ margin: '0', color: '#333', flex: 1 }}>
                  {article.title}
                </h2>
                <span style={{
                  background: getCategoryColor(article.category),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginLeft: '1rem'
                }}>
                  {getCategoryName(article.category)}
                </span>
              </div>
              
              <div style={{ 
                color: '#666', 
                marginBottom: '1rem',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {article.content}
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #e1e5e9',
                paddingTop: '1rem',
                color: '#999',
                fontSize: '0.875rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <span>By <strong>{article.author_name || 'EyeCare Team'}</strong></span>
                <span>
                  {new Date(article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Educational Resources Section */}
      {!loading && articles.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '3rem',
          borderRadius: '12px',
          marginTop: '3rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Need More Information?</h3>
          <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
            If you have specific questions about your eye health or need personalized advice, 
            don't hesitate to consult with our specialists.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="btn"
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              Contact Our Team
            </button>
            <button 
              onClick={() => window.location.href = '/scan'}
              className="btn"
              style={{ 
                background: 'white', 
                color: '#667eea'
              }}
            >
              Get Your Eyes Checked
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Awareness;

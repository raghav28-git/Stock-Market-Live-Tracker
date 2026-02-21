import React, { useState } from 'react';
import { register } from '../services/api';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'INVESTOR'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      await register(formData);
      onRegister();
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '3rem',
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea, #764ba2)'
        }}></div>
        
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#764ba2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem'
          }}>
            👤
          </div>
          <h2 style={{margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 'bold'}}>Create Account</h2>
          <p style={{margin: 0, color: '#718096', fontSize: '1rem'}}>Join us to start trading</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem'}}>
                FIRST NAME
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#f7fafc'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.backgroundColor = '#f7fafc';
                }}
                required
              />
            </div>
            
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem'}}>
                LAST NAME
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#f7fafc'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.backgroundColor = '#f7fafc';
                }}
                required
              />
            </div>
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem'}}>
              USERNAME
            </label>
            <input
              type="text"
              name="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: '#f7fafc'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f7fafc';
              }}
              required
            />
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem'}}>
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: '#f7fafc'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f7fafc';
              }}
              required
            />
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem'}}>
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: '#f7fafc'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f7fafc';
              }}
              required
            />
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem'}}>
              ACCOUNT TYPE
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: '#f7fafc'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f7fafc';
              }}
            >
              <option value="GUEST">👤 Guest User</option>
              <option value="INVESTOR">💼 Investor</option>
              <option value="ADMIN">⚡ Administrator</option>
            </select>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fed7d7',
              color: '#c53030',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              border: '1px solid #feb2b2'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginBottom: '1.5rem'
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-1px)')}
            onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? '🔄 Creating Account...' : '✨ Create Account'}
          </button>
        </form>

        <div style={{textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0'}}>
          <p style={{margin: 0, color: '#718096', fontSize: '0.875rem'}}>
            Already have an account?{' '}
            <span 
              onClick={onSwitchToLogin}
              style={{
                color: '#667eea',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onMouseOver={(e) => e.target.style.color = '#5a67d8'}
              onMouseOut={(e) => e.target.style.color = '#667eea'}
            >
              Sign in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
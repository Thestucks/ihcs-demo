import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi sederhana
   

    // Login dengan API
    setLoading(true);
    const success = await login({ username, password });
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
      // Error akan ditampilkan dari context
      setError('Username atau password salah. Silahkan coba lagi.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
        Login
      </h2>

      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <div className="field-group">
        <label className="field-label">Username</label>
        <div className="field-wrapper">
          <span>👤</span>
          <input
            type="text"
            className="field-input"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Password</label>
        <div className="field-wrapper">
          <span>🔒</span>
          <input
            type="password"
            className="field-input"
            placeholder="Masukkan password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <button
        type="button"
        className="forgot-link"
        onClick={() => navigate('/forgot-password')}
        disabled={loading}
        style={{
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          padding: 0,
          marginBottom: '1rem'
        }}
      >
        Lupa Password?
      </button>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Sedang login...' : 'Masuk'}
      </button>

      <p style={{
        marginTop: '1rem',
        fontSize: '0.75rem',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        Gunakan username dan password Anda untuk login
      </p>
    </form>
  );
};

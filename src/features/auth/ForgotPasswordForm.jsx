import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validasi email
    if (!email) {
      setError('Email harus diisi');
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    // Simulasi pengiriman email (ganti dengan API call yang sebenarnya)
    setIsSubmitted(true);
    setMessage('Link reset password telah dikirim ke email Anda. Silakan cek inbox Anda.');
    
    // Reset form setelah 3 detik
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
        Lupa Password?
      </h2>

      <p style={{ 
        marginBottom: '1.5rem', 
        fontSize: '0.875rem', 
        color: '#6b7280',
        lineHeight: '1.5'
      }}>
        Masukkan email akun Anda dan kami akan mengirimkan link untuk mereset password Anda.
      </p>

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

      {message && (
        <div style={{ 
          padding: '0.75rem', 
          marginBottom: '1rem', 
          backgroundColor: '#dcfce7', 
          color: '#166534', 
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        }}>
          {message}
        </div>
      )}

      <div className="field-group">
        <label className="field-label">Email</label>
        <div className="field-wrapper">
          <span>✉️</span>
          <input
            type="email"
            className="field-input"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitted}
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="btn-primary"
        disabled={isSubmitted}
        style={{ opacity: isSubmitted ? 0.6 : 1 }}
      >
        {isSubmitted ? 'Mengirim...' : 'Kirim Link Reset Password'}
      </button>

      <button
        type="button"
        onClick={() => navigate('/login')}
        style={{
          width: '100%',
          padding: '0.75rem',
          marginTop: '0.5rem',
          backgroundColor: 'transparent',
          color: '#3b82f6',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: 'color 0.2s'
        }}
      >
        Kembali ke Login
      </button>
    </form>
  );
};

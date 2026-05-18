import React from 'react';
import '../styles/UnderConstruction.css';

function UnderConstruction({ title, icon = '🚀' }) {
  return (
    <div className="under-construction-container">
      <div className="construction-content">
        <div className="construction-icon">{icon}</div>
        <h1>{title || 'Fitur Sedang Dalam Pengerjaan'}</h1>
        <p>Halaman ini sedang kami kembangkan dengan fitur-fitur terbaik untuk Anda.</p>
        <div className="construction-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p className="progress-text">Segera Hadir</p>
        </div>
        <div className="construction-features">
          <h3>Fitur yang akan datang:</h3>
          <ul>
            <li>✓ Interface yang user-friendly</li>
            <li>✓ Integrasi sistem yang seamless</li>
            <li>✓ Performa yang optimal</li>
            <li>✓ Keamanan data terjamin</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UnderConstruction;

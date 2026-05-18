import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigateProfile = () => {
    navigate('/profile');
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="user-card">
      {/* Card Header with Avatar */}
      <div className="user-card-header">
        <div className="user-avatar">
          {user?.profilePhoto || user?.profile_photo ? (
            <img
              src={`http://localhost:5000/uploads/${user.profilePhoto || user.profile_photo}`}
              alt="Avatar"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <span className="avatar-icon">👤</span>
          )}
        </div>
        <div className="user-basic-info">
          <h3 className="user-name">{user?.name || user?.user_name || user?.userName || 'Nama User'}</h3>
          <p className="user-department">{user?.department || 'Departemen User'}</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="status-badge">
        <span className="status-indicator">●</span>
        <span className="status-text">{user?.status || 'Aktif'}</span>
      </div>

      {/* Divider */}
      <div className="card-divider"></div>

      {/* User Info Grid */}
      <div className="user-details-grid">
        <div className="detail-item">
          <span className="detail-label">Grade</span>
          <span className="detail-value">{user?.grade || '-'}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Unit</span>
          <span className="detail-value">{user?.unit || '-'}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Tanggal Masuk</span>
          <span className="detail-value">{formatDate(user?.tanggalMasuk || user?.tanggal_masuk)}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Tanggal Lahir</span>
          <span className="detail-value">{formatDate(user?.tanggalLahir || user?.tanggal_lahir)}</span>
        </div>
      </div>

      {/* Action Button */}
      <button className="btn-edit-profile" onClick={handleNavigateProfile}>
        <span>Kelola Profil</span>
        <span className="btn-arrow">→</span>
      </button>
    </div>
  );
};

export default UserCard;

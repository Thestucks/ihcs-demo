import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/Sidebar';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeMenu, setActiveMenu] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const [formData, setFormData] = useState({
    user_name: '',
    department: '',
    unit: '',
    grade: '',
    status: '',
    tanggal_masuk: '',
    tanggal_lahir: '',
    email: '',
    mobile_number: '',
    gender: 'male'
  });

  const [originalData, setOriginalData] = useState({});

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    retypePassword: '',
    otp: ''
  });

  // Load profile data saat component mount
  useEffect(() => {
    const userId = user?.id || user?.user_id;
    if (userId) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    const userId = user?.id || user?.user_id;
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
      const data = await response.json();

      if (data.success && (data.profile || data.data)) {
        const profileObj = data.profile || data.data;
        const profileData = {
          user_name: profileObj.user_name || profileObj.userName || '',
          department: profileObj.department || '',
          unit: profileObj.unit || '',
          grade: profileObj.grade || '',
          status: profileObj.status || '',
          tanggal_masuk: profileObj.tanggal_masuk || profileObj.tanggalMasuk || '',
          tanggal_lahir: profileObj.tanggal_lahir || profileObj.tanggalLahir || '',
          email: profileObj.email || '',
          mobile_number: profileObj.mobile_number || profileObj.mobileNumber || '',
          gender: profileObj.gender || 'male'
        };
        setFormData(profileData);
        setOriginalData(profileData);
      }
    } catch (err) {
      setError('Gagal memuat data profil');
      console.error('Load profile error:', err);
      // Set default values dari user context jika tersedia
      if (user) {
        setFormData(prev => ({
          ...prev,
          user_name: user.name || '',
          department: user.department || '',
          unit: user.unit || '',
          grade: user.grade || '',
          status: user.status || '',
          email: user.email || '',
          mobile_number: user.mobileNumber || ''
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async () => {
    const userId = user?.id || user?.user_id;
    if (!userId) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const formDataToSend = new FormData();
      // Tambahkan semua data form
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Tambahkan file jika ada
      if (selectedFile) {
        formDataToSend.append('profile_photo', selectedFile);
      }

      const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
        method: 'PUT',
        body: formDataToSend
        // Catatan: Header Content-Type tidak diatur manual agar browser mengatur boundary multipart/form-data
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Gagal menyimpan profil');
        return;
      }

      // Update user context to sync with dashboard
      updateUser({
        name: formData.user_name,
        department: formData.department,
        unit: formData.unit,
        grade: formData.grade,
        status: formData.status,
        email: formData.email,
        mobileNumber: formData.mobile_number,
        gender: formData.gender,
        tanggalMasuk: formData.tanggal_masuk,
        tanggalLahir: formData.tanggal_lahir,
        profilePhoto: data.data?.profilePhoto || data.profile_photo || user.profilePhoto
      });

      setSuccess('Profil berhasil diperbarui');
      setOriginalData({ ...formData });
      setIsEditing(false);
      setSelectedFile(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Gagal terhubung ke server');
      console.error('Save profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - restore original data
      setFormData({ ...originalData });
      setIsEditing(false);
      setError('');
      setSelectedFile(null);
      setPhotoPreview(null);
    } else {
      setIsEditing(true);
    }
  };

  const handleChangePassword = async () => {
    const userId = user?.id || user?.user_id;
    if (!userId) return;

    // Validasi
    if (!passwordData.currentPassword) {
      setError('Password saat ini harus diisi');
      return;
    }
    if (!passwordData.newPassword) {
      setError('Password baru harus diisi');
      return;
    }
    if (passwordData.newPassword !== passwordData.retypePassword) {
      setError('Password baru tidak cocok');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(`${API_BASE_URL}/profile/${userId}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Gagal mengubah password');
        return;
      }

      setSuccess('Password berhasil diubah');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        retypePassword: '',
        otp: ''
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Gagal terhubung ke server');
      console.error('Change password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    console.log('Resending OTP');
    // TODO: API call to resend OTP if needed
    setSuccess('OTP telah dikirim ke email Anda');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const validatePassword = () => {
    const pass = passwordData.newPassword;
    return {
      hasMinLength: pass.length >= 4,
      notSameAsCurrent: pass !== passwordData.currentPassword,
      noCommonPassword: !['123456', 'password', 'admin'].includes(pass.toLowerCase())
    };
  };

  const passwordValidation = validatePassword();

  if (loading && activeMenu === 'personal' && !formData.user_name) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <Sidebar />
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-sidebar-header">
            <div className="profile-avatar">
              <span>👤</span>
            </div>
            <div className="profile-user-info">
              <h4>Hello</h4>
              <p>{formData.user_name || user?.name || 'User'}</p>
            </div>
          </div>

          <button
            className={`profile-menu-item ${activeMenu === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveMenu('personal')}
          >
            Personal Information
          </button>
          <button
            className={`profile-menu-item ${activeMenu === 'password' ? 'active' : ''}`}
            onClick={() => setActiveMenu('password')}
          >
            Pengelola Sandi
          </button>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeMenu === 'personal' && (
            <div className="profile-content">
              {/* Notification Messages */}
              {error && (
                <div style={{
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  borderRadius: '0.5rem'
                }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  borderRadius: '0.5rem'
                }}>
                  {success}
                </div>
              )}

              {/* Tabs */}
              <div className="profile-tabs">
                <button className="profile-tab active">
                  Personal Information
                </button>
                <button
                  className={`btn-edit-mode ${isEditing ? 'editing' : ''}`}
                  onClick={handleEditToggle}
                  style={{
                    marginLeft: 'auto',
                    padding: '0.5rem 1rem',
                    backgroundColor: isEditing ? '#ef4444' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {isEditing ? '✕ Cancel Edit' : '✎ Edit Profile'}
                </button>
              </div>

              {/* Profile Photo Section */}
              <div className="profile-photo-section">
                <div className="profile-photo-box" onClick={handlePhotoClick} style={{ cursor: isEditing ? 'pointer' : 'default' }}>
                  <img
                    src={photoPreview || (user?.profilePhoto || user?.profile_photo ? `http://localhost:5000/uploads/${user.profilePhoto || user?.profile_photo}` : "https://placehold.co/150")}
                    alt="Profile"
                    className="profile-photo"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                  {isEditing && (
                    <button
                      className="btn-change-photo"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current.click();
                      }}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        backgroundColor: '#e5e7eb',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      📷 Change Photo
                    </button>
                  )}
                </div>
                <div className="profile-gender">
                  <label>Your Gender</label>
                  <div className="gender-options">
                    <label style={{ opacity: !isEditing ? 0.7 : 1 }}>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      Male
                    </label>
                    <label style={{ opacity: !isEditing ? 0.7 : 1 }}>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      Female
                    </label>
                  </div>
                </div>
              </div>

              {/* Personal Information Form */}
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Username</label>
                    <div className="form-value-with-edit">
                      <input
                        type="text"
                        name="username"
                        value={user?.username || ''}
                        disabled
                        className="form-input disabled"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input
                      type="text"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleInputChange}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      placeholder="Nama Lengkap"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Unit</label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      placeholder="Unit"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      placeholder="Department"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Grade</label>
                    <input
                      type="text"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      placeholder="Grade"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      disabled={!isEditing}
                    >
                      <option value="">Pilih Status</option>
                      <option value="Aktif">Aktif</option>
                      <option value="aktif">aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                      <option value="Cuti">Cuti</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tanggal Masuk</label>
                    <input
                      type="date"
                      name="tanggal_masuk"
                      value={formData.tanggal_masuk}
                      onChange={handleInputChange}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tanggal Lahir</label>
                    <input
                      type="date"
                      name="tanggal_lahir"
                      value={formData.tanggal_lahir}
                      onChange={handleInputChange}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      placeholder="email@example.com"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile_number"
                      value={formData.mobile_number}
                      onChange={handleInputChange}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      placeholder="082131XXXX"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button className="btn-save" onClick={handleSave} disabled={loading}>
                      {loading ? 'Saving...' : '💾 Save Changes'}
                    </button>
                    <button className="btn-cancel" onClick={handleEditToggle} disabled={loading}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeMenu === 'password' && (
            <div className="profile-content">
              {/* Notification Messages */}
              {error && (
                <div style={{
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  borderRadius: '0.5rem'
                }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  borderRadius: '0.5rem'
                }}>
                  {success}
                </div>
              )}

              <div className="password-header">
                <h3>Change Password</h3>
                <button className="resend-otp-btn" onClick={handleResendOTP}>
                  Resend OTP
                </button>
              </div>

              <div className="change-password-form">
                <div className="form-group-password">
                  <label>Type Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Type Current Password"
                  />
                </div>

                <div className="form-row-password">
                  <div className="form-group-password">
                    <label>Type New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Type New Password"
                    />
                  </div>
                  <div className="form-group-password">
                    <label>Retype New Password</label>
                    <input
                      type="password"
                      name="retypePassword"
                      value={passwordData.retypePassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Retype New Password"
                    />
                  </div>
                </div>

                <div className="form-group-password">
                  <label>Enter OTP Send To {user?.email || 'your email'}</label>
                  <input
                    type="text"
                    name="otp"
                    value={passwordData.otp}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Enter OTP"
                  />
                </div>

                <button className="btn-change-password" onClick={handleChangePassword} disabled={loading}>
                  {loading ? 'Changing...' : 'CHANGE PASSWORD'}
                </button>

                <div className="password-requirements">
                  <p className="requirements-title">Your New Password Must:</p>
                  <ul className="requirements-list">
                    <li className={passwordValidation.hasMinLength ? 'valid' : 'invalid'}>
                      <span className="requirement-icon">✓</span>
                      Be At Least 4 Characters In Length
                    </li>
                    <li className={passwordValidation.notSameAsCurrent ? 'valid' : 'invalid'}>
                      <span className="requirement-icon">✓</span>
                      Not Be Same As Your Current Password
                    </li>
                    <li className={passwordValidation.noCommonPassword ? 'valid' : 'invalid'}>
                      <span className="requirement-icon">✓</span>
                      Not Contain Common Passwords
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

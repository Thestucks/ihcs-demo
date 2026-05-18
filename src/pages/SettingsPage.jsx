import React, { useState, useEffect } from 'react';
import Navbar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/Sidebar';
import bgImg from '../assets/bg.png';
import '../styles/Dashboard.css';
import '../styles/Settings.css';

const API_BASE_URL = 'http://localhost:5000/api';

function SettingsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
    user_name: '',
    email: '',
    gender: 'male',
    department: '',
    unit: '',
    grade: '',
    status: 'Aktif',
    mobile_number: ''
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data || data.users || []);
      }
    } catch (err) {
      setError('Gagal memuat data pengguna');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'user',
      user_name: '',
      email: '',
      gender: 'male',
      department: '',
      unit: '',
      grade: '',
      status: 'Aktif',
      mobile_number: ''
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Show success message
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        showSuccess('Pengguna berhasil ditambahkan');
        setShowAddModal(false);
        resetForm();
        fetchUsers();
      } else {
        setError(data.message || 'Gagal menambahkan pengguna');
      }
    } catch (err) {
      setError('Gagal menambahkan pengguna');
      console.error(err);
    }
  };

  // Edit user
  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        showSuccess('Pengguna berhasil diperbarui');
        setShowEditModal(false);
        resetForm();
        fetchUsers();
      } else {
        setError(data.message || 'Gagal memperbarui pengguna');
      }
    } catch (err) {
      setError('Gagal memperbarui pengguna');
      console.error(err);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser.user_id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        showSuccess('Pengguna berhasil dihapus');
        setShowDeleteModal(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        setError(data.message || 'Gagal menghapus pengguna');
      }
    } catch (err) {
      setError('Gagal menghapus pengguna');
      console.error(err);
    }
  };

  // Open edit modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      password: '',
      role: user.role || 'user',
      user_name: user.user_name || '',
      email: user.email || '',
      gender: user.gender || 'male',
      department: user.department || '',
      unit: user.unit || '',
      grade: user.grade || '',
      status: user.status || 'Aktif',
      mobile_number: user.mobile_number || ''
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  return (
    <div className="dashboard" style={{ backgroundImage: `url(${bgImg})` }}>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <div className="settings-container">
            <div className="settings-header">
              <h1>⚙️ Pengaturan - Manajemen Akun</h1>
              <button
                className="btn-add-user"
                onClick={() => { resetForm(); setShowAddModal(true); }}
              >
                ➕ Tambah Akun
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {loading ? (
              <div className="loading">Memuat data...</div>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Username</th>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="no-data">Tidak ada data pengguna</td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr key={user.user_id}>
                          <td>{index + 1}</td>
                          <td>{user.username}</td>
                          <td>{user.user_name || '-'}</td>
                          <td>{user.email || '-'}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                            </span>
                          </td>
                          <td>{user.department || '-'}</td>
                          <td>
                            <span className={`status-badge ${user.status?.toLowerCase()}`}>
                              {user.status || 'Aktif'}
                            </span>
                          </td>
                          <td className="action-buttons">
                            <button
                              className="btn-edit"
                              onClick={() => openEditModal(user)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => openDeleteModal(user)}
                              title="Hapus"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add User Modal */}
          {showAddModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>➕ Tambah Akun Baru</h2>
                  <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
                </div>
                <form onSubmit={handleAddUser}>
                  <div className="modal-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Username *</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Password *</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nama Lengkap</label>
                        <input
                          type="text"
                          name="user_name"
                          value={formData.user_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Role *</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>No. Telepon</label>
                        <input
                          type="text"
                          name="mobile_number"
                          value={formData.mobile_number}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="male">Laki-laki</option>
                          <option value="female">Perempuan</option>
                          <option value="other">Lainnya</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Nonaktif">Nonaktif</option>
                          <option value="Cuti">Cuti</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Department</label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Unit</label>
                        <input
                          type="text"
                          name="unit"
                          value={formData.unit}
                          onChange={handleInputChange}
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
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                      Batal
                    </button>
                    <button type="submit" className="btn-submit">
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {showEditModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>✏️ Edit Akun</h2>
                  <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                </div>
                <form onSubmit={handleEditUser}>
                  <div className="modal-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Username *</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Password (kosongkan jika tidak diubah)</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Kosongkan jika tidak diubah"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nama Lengkap</label>
                        <input
                          type="text"
                          name="user_name"
                          value={formData.user_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Role *</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>No. Telepon</label>
                        <input
                          type="text"
                          name="mobile_number"
                          value={formData.mobile_number}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="male">Laki-laki</option>
                          <option value="female">Perempuan</option>
                          <option value="other">Lainnya</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Nonaktif">Nonaktif</option>
                          <option value="Cuti">Cuti</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Department</label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Unit</label>
                        <input
                          type="text"
                          name="unit"
                          value={formData.unit}
                          onChange={handleInputChange}
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
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                      Batal
                    </button>
                    <button type="submit" className="btn-submit">
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal modal-delete">
                <div className="modal-header">
                  <h2>🗑️ Hapus Akun</h2>
                  <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <p className="delete-warning">
                    Apakah Anda yakin ingin menghapus akun <strong>{selectedUser?.username}</strong>?
                  </p>
                  <p className="delete-info">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                    Batal
                  </button>
                  <button className="btn-delete-confirm" onClick={handleDeleteUser}>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;

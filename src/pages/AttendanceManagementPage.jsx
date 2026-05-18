import React, { useState, useEffect } from 'react';
import Navbar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/Sidebar';
import bgImg from '../assets/bg.png';
import '../styles/Attendance.css';
import '../styles/Settings.css';

function AttendanceManagementPage() {
    const [attendances, setAttendances] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUsers();
        fetchAttendances();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://127.0.0.1:5000/api/admin/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.data || data.users || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchAttendances = async () => {
        setLoading(true);
        try {
            let url = 'http://127.0.0.1:5000/api/attendance/admin/all?';
            const params = new URLSearchParams();
            if (selectedUser) params.append('user_id', selectedUser);
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);

            const res = await fetch(url + params.toString());
            const data = await res.json();
            if (data.success) {
                setAttendances(data.data || data.attendances || []);
            }
        } catch (error) {
            console.error('Error fetching attendances:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        fetchAttendances();
    };

    const handleResetFilter = () => {
        setSelectedUser('');
        setStartDate('');
        setEndDate('');
        setTimeout(() => fetchAttendances(), 100);
    };

    const handleEditClick = (attendance) => {
        setEditingAttendance({
            ...attendance,
            check_in_time: attendance.check_in_time ? attendance.check_in_time.replace(' ', 'T').slice(0, 16) : '',
            check_out_time: attendance.check_out_time ? attendance.check_out_time.replace(' ', 'T').slice(0, 16) : ''
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!editingAttendance) return;

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/attendance/admin/${editingAttendance.attendance_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    checkInTime: editingAttendance.check_in_time ? editingAttendance.check_in_time + ':00' : null,
                    checkOutTime: editingAttendance.check_out_time ? editingAttendance.check_out_time + ':00' : null,
                    status: editingAttendance.status,
                    notes: editingAttendance.notes
                })
            });
            const data = await res.json();
            if (data.success) {
                // Update local state immediately for instant UI feedback
                setAttendances(prev => prev.map(att => {
                    if (att.attendance_id === editingAttendance.attendance_id) {
                        return {
                            ...att,
                            check_in_time: editingAttendance.check_in_time ? editingAttendance.check_in_time + ':00' : null,
                            check_out_time: editingAttendance.check_out_time ? editingAttendance.check_out_time + ':00' : null,
                            status: editingAttendance.status,
                            notes: editingAttendance.notes
                        };
                    }
                    return att;
                }));
                setMessage({ type: 'success', text: 'Record berhasil diperbarui' });
                setShowEditModal(false);
                setEditingAttendance(null);
                // Also refresh from server to ensure data consistency
                fetchAttendances();
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' });
        }

        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '-';
        const date = new Date(timeStr);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'present': { label: 'Hadir', class: 'status-present' },
            'late': { label: 'Terlambat', class: 'status-late' },
            'absent': { label: 'Tidak Hadir', class: 'status-absent' }
        };
        return statusMap[status] || { label: status, class: '' };
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // Calculate stats based on current view/filter
    const stats = {
        total: attendances.length,
        present: attendances.filter(a => a.status === 'present').length,
        late: attendances.filter(a => a.status === 'late').length,
        absent: attendances.filter(a => a.status === 'absent').length
    };

    return (
        <div className="dashboard" style={{ backgroundImage: `url(${bgImg})` }}>
            <div className="dashboard-bg-shape shape-1"></div>
            <div className="dashboard-bg-shape shape-2"></div>

            <Navbar />
            <div className="dashboard-container">
                <Sidebar />
                <main className="main-content">
                    <div className="settings-page attendance-admin">
                        <div className="page-header">
                            <h1 className="page-title">⏰ Kelola Absensi</h1>
                            <p className="page-subtitle">Monitor dan kelola data absensi karyawan</p>
                        </div>

                        {/* Message Display */}
                        {message.text && (
                            <div className={`attendance-message ${message.type}`}>
                                {message.type === 'success' ? '✅' : '❌'} {message.text}
                            </div>
                        )}

                        {/* Stats Cards */}
                        <div className="recap-stats">
                            <div className="stat-card stat-total">
                                <div className="stat-icon">👥</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats.total}</span>
                                    <span className="stat-label">Total Record</span>
                                </div>
                            </div>
                            <div className="stat-card stat-present">
                                <div className="stat-icon">✅</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats.present}</span>
                                    <span className="stat-label">Hadir</span>
                                </div>
                            </div>
                            <div className="stat-card stat-late">
                                <div className="stat-icon">⚠️</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats.late}</span>
                                    <span className="stat-label">Terlambat</span>
                                </div>
                            </div>
                            <div className="stat-card stat-absent">
                                <div className="stat-icon">❌</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats.absent}</span>
                                    <span className="stat-label">Tidak Hadir</span>
                                </div>
                            </div>
                        </div>

                        {/* Filter Section */}
                        <div className="filter-bar admin-filter">
                            <div className="filter-group">
                                <label>User</label>
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Semua User</option>
                                    {users.map(u => (
                                        <option key={u.user_id} value={u.user_id}>
                                            {u.user_name || u.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Dari</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="filter-input"
                                />
                            </div>
                            <div className="filter-group">
                                <label>Sampai</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="filter-input"
                                />
                            </div>
                            <div className="filter-actions">
                                <button className="btn-filter" onClick={handleFilter}>🔍 Filter</button>
                                <button className="btn-reset" onClick={handleResetFilter}>↻ Reset</button>
                            </div>
                        </div>

                        {/* Attendance Table */}
                        <div className="table-container">
                            {loading ? (
                                <div className="table-loading">⏳ Memuat data...</div>
                            ) : attendances.length === 0 ? (
                                <div className="table-empty">
                                    <span className="empty-icon">📭</span>
                                    <p>Tidak ada data absensi yang ditemukan</p>
                                </div>
                            ) : (
                                <table className="data-table admin-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Tanggal</th>
                                            <th>Check In</th>
                                            <th>Check Out</th>
                                            <th>Status</th>
                                            <th>Catatan</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendances.map((att) => (
                                            <tr key={att.attendance_id}>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar-small">
                                                            {getInitials(att.user_name || att.username)}
                                                        </div>
                                                        <span className="user-name-text">{att.user_name || att.username}</span>
                                                    </div>
                                                </td>
                                                <td>{formatDate(att.date)}</td>
                                                <td className="time-cell">{formatTime(att.check_in_time)}</td>
                                                <td className="time-cell">{formatTime(att.check_out_time)}</td>
                                                <td>
                                                    <span className={`status-badge ${getStatusBadge(att.status).class}`}>
                                                        {getStatusBadge(att.status).label}
                                                    </span>
                                                </td>
                                                <td className="notes-cell">{att.notes || '-'}</td>
                                                <td>
                                                    <button
                                                        className="btn-action btn-edit"
                                                        onClick={() => handleEditClick(att)}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Edit Modal */}
                        {showEditModal && editingAttendance && (
                            <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                                <div className="modal" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <h2>Edit Absensi</h2>
                                        <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                                    </div>
                                    <div className="modal-body">
                                        <p className="modal-subtitle">
                                            Update data absensi karyawan
                                        </p>

                                        <div className="modal-user-info">
                                            <div className="user-avatar-large">
                                                {getInitials(editingAttendance.user_name || editingAttendance.username)}
                                            </div>
                                            <div>
                                                <strong>{editingAttendance.user_name || editingAttendance.username}</strong>
                                                <div className="text-sm text-gray">{formatDate(editingAttendance.date)}</div>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Check In</label>
                                                <input
                                                    type="datetime-local"
                                                    value={editingAttendance.check_in_time}
                                                    onChange={(e) => setEditingAttendance({ ...editingAttendance, check_in_time: e.target.value })}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Check Out</label>
                                                <input
                                                    type="datetime-local"
                                                    value={editingAttendance.check_out_time}
                                                    onChange={(e) => setEditingAttendance({ ...editingAttendance, check_out_time: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group" style={{ marginBottom: '16px' }}>
                                            <label>Status</label>
                                            <select
                                                value={editingAttendance.status}
                                                onChange={(e) => setEditingAttendance({ ...editingAttendance, status: e.target.value })}
                                                className="status-select"
                                            >
                                                <option value="present">✅ Hadir</option>
                                                <option value="late">⚠️ Terlambat</option>
                                                <option value="absent">❌ Tidak Hadir</option>
                                            </select>
                                        </div>

                                        <div className="form-group" style={{ marginBottom: '16px' }}>
                                            <label>Catatan</label>
                                            <textarea
                                                value={editingAttendance.notes || ''}
                                                onChange={(e) => setEditingAttendance({ ...editingAttendance, notes: e.target.value })}
                                                placeholder="Tambahkan catatan keterlambatan atau absen..."
                                                style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0', minHeight: '80px', resize: 'vertical' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Batal</button>
                                        <button className="btn-save" onClick={handleSaveEdit}>💾 Simpan Perubahan</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AttendanceManagementPage;

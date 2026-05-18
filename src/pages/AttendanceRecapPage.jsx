import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/Sidebar';
import bgImg from '../assets/bg.png';
import '../styles/Attendance.css';

function AttendanceRecapPage() {
    const { user } = useAuth();
    const [attendances, setAttendances] = useState([]);
    const [recap, setRecap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (user?.id || user?.user_id) {
            fetchAttendanceData();
        }
    }, [user, selectedMonth, selectedYear]);

    const fetchAttendanceData = async () => {
        setLoading(true);
        try {
            // Fetch attendance records
            const recordsRes = await fetch(
                `http://127.0.0.1:5000/api/attendance/${user.id || user.user_id}?month=${selectedMonth}&year=${selectedYear}`
            );
            const recordsData = await recordsRes.json();
            if (recordsData.success) {
                setAttendances(recordsData.data || recordsData.attendances || []);
            }

            // Fetch recap
            const recapRes = await fetch(
                `http://127.0.0.1:5000/api/attendance/recap/${user.id || user.user_id}?month=${selectedMonth}&year=${selectedYear}`
            );
            const recapData = await recapRes.json();
            if (recapData.success) {
                setRecap(recapData.data || recapData.recap || null);
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        if (Array.isArray(dateStr)) {
            const date = new Date(dateStr[0], dateStr[1] - 1, dateStr[2]);
            return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
        }
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '-';
        if (Array.isArray(timeStr)) {
            const date = new Date(timeStr[0], timeStr[1] - 1, timeStr[2], timeStr[3], timeStr[4], timeStr[5] || 0);
            return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', timeZoneName: 'short' });
        }
        const date = new Date(timeStr);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', timeZoneName: 'short' });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'present': { label: 'Hadir', class: 'status-present' },
            'late': { label: 'Terlambat', class: 'status-late' },
            'absent': { label: 'Tidak Hadir', class: 'status-absent' }
        };
        return statusMap[status] || { label: status, class: '' };
    };

    const months = [
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' }
    ];

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 2; y <= currentYear + 1; y++) {
        years.push(y);
    }

    return (
        <div className="dashboard" style={{ backgroundImage: `url(${bgImg})` }}>
            <div className="dashboard-bg-shape shape-1"></div>
            <div className="dashboard-bg-shape shape-2"></div>

            <Navbar />
            <div className="dashboard-container">
                <Sidebar />
                <main className="main-content">
                    <div className="attendance-page">
                        <h1 className="page-title">📊 Rekap Absensi</h1>

                        {/* Filter Section */}
                        <div className="filter-section">
                            <div className="filter-group">
                                <label>Bulan:</label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="filter-select"
                                >
                                    {months.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Tahun:</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="filter-select"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Recap Statistics */}
                        {recap && (
                            <div className="recap-stats">
                                <div className="stat-card stat-total">
                                    <div className="stat-icon">📅</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{recap.total_days || 0}</span>
                                        <span className="stat-label">Total Hari</span>
                                    </div>
                                </div>
                                <div className="stat-card stat-present">
                                    <div className="stat-icon">✅</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{recap.present_days || 0}</span>
                                        <span className="stat-label">Hadir</span>
                                    </div>
                                </div>
                                <div className="stat-card stat-late">
                                    <div className="stat-icon">⏰</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{recap.late_days || 0}</span>
                                        <span className="stat-label">Terlambat</span>
                                    </div>
                                </div>
                                <div className="stat-card stat-absent">
                                    <div className="stat-icon">❌</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{recap.absent_days || 0}</span>
                                        <span className="stat-label">Tidak Hadir</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Attendance Table */}
                        <div className="attendance-table-container">
                            <h3>📋 Riwayat Absensi</h3>
                            {loading ? (
                                <div className="table-loading">⏳ Memuat data...</div>
                            ) : attendances.length === 0 ? (
                                <div className="table-empty">
                                    <span className="empty-icon">📭</span>
                                    <p>Tidak ada data absensi untuk periode ini</p>
                                </div>
                            ) : (
                                <table className="attendance-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Tanggal</th>
                                            <th>Check In</th>
                                            <th>Check Out</th>
                                            <th>Status</th>
                                            <th>Catatan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendances.map((att, idx) => (
                                            <tr key={att.attendanceId || att.attendance_id || idx}>
                                                <td>{idx + 1}</td>
                                                <td>{formatDate(att.date)}</td>
                                                <td>{formatTime(att.checkInTime || att.check_in_time)}</td>
                                                <td>{formatTime(att.checkOutTime || att.check_out_time)}</td>
                                                <td>
                                                    <span className={`status-badge ${getStatusBadge(att.status).class}`}>
                                                        {getStatusBadge(att.status).label}
                                                    </span>
                                                </td>
                                                <td>{att.notes || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AttendanceRecapPage;

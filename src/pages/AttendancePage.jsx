import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/Sidebar';
import LocationMap from '../components/attendance/LocationMap';
import bgImg from '../assets/bg.png';
import '../styles/Attendance.css';
import 'leaflet/dist/leaflet.css';

function AttendancePage() {
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Geofencing states
    const [userLocation, setUserLocation] = useState(null);
    const [geofenceZones, setGeofenceZones] = useState([]);
    const [locationError, setLocationError] = useState('');
    const [isWithinZone, setIsWithinZone] = useState(false);
    const [nearestZone, setNearestZone] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(true);

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch today's attendance status
    useEffect(() => {
        if (user?.id || user?.user_id) {
            fetchTodayAttendance();
        }
    }, [user]);

    // Get user location and fetch geofence zones
    useEffect(() => {
        getUserLocation();
        fetchActiveZones();
    }, []);

    // Check if user is within zone when location or zones change
    useEffect(() => {
        if (userLocation && Array.isArray(geofenceZones) && geofenceZones.length > 0) {
            checkLocationWithinZone();
        }
    }, [userLocation, geofenceZones]);

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation tidak didukung oleh browser Anda');
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                setLocationError('');
                setLoadingLocation(false);
            },
            (error) => {
                let errorMsg = 'Tidak dapat mendapatkan lokasi Anda';
                if (error.code === error.PERMISSION_DENIED) {
                    errorMsg = 'Izin lokasi ditolak. Silakan aktifkan izin lokasi di browser Anda.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMsg = 'Informasi lokasi tidak tersedia';
                } else if (error.code === error.TIMEOUT) {
                    errorMsg = 'Timeout mendapatkan lokasi';
                }
                setLocationError(errorMsg);
                setLoadingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const fetchActiveZones = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/geofence-zones/active');
            const data = await response.json();
            if (data.success) {
                setGeofenceZones(data.data || data.zones || []);
            } else {
                setGeofenceZones([]);
            }
        } catch (error) {
            console.error('Error fetching geofence zones:', error);
            setGeofenceZones([]);
        }
    };

    const checkLocationWithinZone = () => {
        if (!userLocation || !Array.isArray(geofenceZones) || geofenceZones.length === 0) return;

        let nearestDist = Infinity;
        let nearest = null;
        let withinAnyZone = false;

        geofenceZones.forEach(zone => {
            const currentLat = parseFloat(zone.latitude);
            const currentLon = parseFloat(zone.longitude);
            const currentRad = parseFloat(zone.radius);
            const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                currentLat,
                currentLon
            );

            if (distance < nearestDist) {
                nearestDist = distance;
                nearest = { ...zone, distance: Math.round(distance), zone_name: zone.zoneName || zone.zone_name };
            }

            if (distance <= currentRad) {
                withinAnyZone = true;
            }
        });

        setIsWithinZone(withinAnyZone);
        setNearestZone(nearest);
    };

    // Haversine formula to calculate distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371000; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    };

    const fetchTodayAttendance = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/attendance/today/${user.id || user.user_id}`);
            const data = await response.json();
            if (data.success) {
                setTodayAttendance(data.data || data.attendance || null);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        if (!userLocation) {
            setMessage({ type: 'error', text: 'Lokasi Anda belum tersedia. Mohon aktifkan izin lokasi.' });
            return;
        }

        if (!isWithinZone) {
            setMessage({
                type: 'error',
                text: `Anda harus berada di dalam zona untuk check-in. Jarak ke ${nearestZone?.zone_name}: ${nearestZone?.distance} meter`
            });
            return;
        }

        setActionLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await fetch('http://127.0.0.1:5000/api/attendance/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id || user.user_id,
                    checkInLatitude: userLocation.latitude,
                    checkInLongitude: userLocation.longitude
                })
            });
            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                fetchTodayAttendance();
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan saat check-in' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        if (!userLocation) {
            setMessage({ type: 'error', text: 'Lokasi Anda belum tersedia. Mohon aktifkan izin lokasi.' });
            return;
        }

        if (!isWithinZone) {
            setMessage({
                type: 'error',
                text: `Anda harus berada di dalam zona untuk check-out. Jarak ke ${nearestZone?.zone_name}: ${nearestZone?.distance} meter`
            });
            return;
        }

        setActionLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await fetch('http://127.0.0.1:5000/api/attendance/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id || user.user_id,
                    checkOutLatitude: userLocation.latitude,
                    checkOutLongitude: userLocation.longitude
                })
            });
            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                fetchTodayAttendance();
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan saat check-out' });
        } finally {
            setActionLoading(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' });
    };

    const formatTimeFromString = (timeStr) => {
        if (!timeStr) return '-';
        // Handle java array timestamp ([2026, 2, 26, 12, 30]) or normal string timestamp
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

    return (
        <div className="dashboard" style={{ backgroundImage: `url(${bgImg})` }}>
            <div className="dashboard-bg-shape shape-1"></div>
            <div className="dashboard-bg-shape shape-2"></div>

            <Navbar />
            <div className="dashboard-container">
                <Sidebar />
                <main className="main-content">
                    <div className="attendance-page">
                        {/* Time Display Header */}
                        <div className="time-display-header">
                            <div className="current-time-huge">{currentTime.toLocaleTimeString('id-ID', { hour12: false, timeZone: 'Asia/Jakarta' }).replace(/:/g, '.')}</div>
                            <div className="current-date-text">{formatDate(currentTime)}</div>
                        </div>

                        {/* Unified Main Card matching Image Layer */}
                        <div className="attendance-main-card">
                            {/* Location Status Bar */}
                            {loadingLocation ? (
                                <div className="location-alert-bar loading">🔍 Mendapatkan lokasi Anda...</div>
                            ) : locationError ? (
                                <div className="location-alert-bar error">
                                    ❌ {locationError} <button onClick={getUserLocation} className="btn-resync" style={{marginLeft: '10px', padding: '2px 8px', borderRadius: '4px'}}>🔄 Coba Lagi</button>
                                </div>
                            ) : userLocation ? (
                                isWithinZone ? (
                                    <div className="location-alert-bar success">
                                        <span className="status-icon-round">✔</span> Anda berada dalam zona geofence.
                                    </div>
                                ) : (
                                    <div className="location-alert-bar error">
                                        <span className="status-icon-round">❌</span> Anda di luar zona. Jarak ke {nearestZone?.zone_name}: {nearestZone?.distance}m
                                    </div>
                                )
                            ) : null}

                            {/* Location Map Embedded */}
                            {userLocation && (
                                <div className="map-embedded-wrapper">
                                    <LocationMap
                                        userLocation={userLocation}
                                        geofenceZones={geofenceZones}
                                        isWithinZone={isWithinZone}
                                    />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="attendance-action-row">
                                <button
                                    className={`btn-flat ${!(todayAttendance?.checkInTime || todayAttendance?.check_in_time) ? 'btn-flat-checkin' : 'btn-flat-done'}`}
                                    onClick={handleCheckIn}
                                    disabled={actionLoading || !userLocation || !isWithinZone || !!(todayAttendance?.checkInTime || todayAttendance?.check_in_time)}
                                >
                                    {(todayAttendance?.checkInTime || todayAttendance?.check_in_time) 
                                      ? `✓ Check In: ${formatTimeFromString(todayAttendance.checkInTime || todayAttendance.check_in_time)}` 
                                      : 'Check In'}
                                </button>
                                
                                <button
                                    className={`btn-flat ${(!(todayAttendance?.checkInTime || todayAttendance?.check_in_time) || !!(todayAttendance?.checkOutTime || todayAttendance?.check_out_time)) ? 'btn-flat-disabled' : 'btn-flat-checkout'}`}
                                    onClick={handleCheckOut}
                                    disabled={actionLoading || !userLocation || !isWithinZone || !(todayAttendance?.checkInTime || todayAttendance?.check_in_time) || !!(todayAttendance?.checkOutTime || todayAttendance?.check_out_time)}
                                >
                                    {(todayAttendance?.checkOutTime || todayAttendance?.check_out_time) 
                                      ? `✓ Check Out: ${formatTimeFromString(todayAttendance.checkOutTime || todayAttendance.check_out_time)}` 
                                      : 'Check Out'}
                                </button>
                            </div>
                        </div>

                        {/* Message Display Notification */}
                        {message.text && (
                            <div className={`attendance-message ${message.type}`}>
                                {message.type === 'success' ? '✅' : '❌'} {message.text}
                            </div>
                        )}

                        {/* Today Status Summary */}
                        {todayAttendance && (
                            <div className="today-summary">
                                <h3>📊 Status Hari Ini</h3>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summary-label">Check In</span>
                                        <span className="summary-value">{formatTimeFromString(todayAttendance.checkInTime || todayAttendance.check_in_time)}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Check Out</span>
                                        <span className="summary-value">{formatTimeFromString(todayAttendance.checkOutTime || todayAttendance.check_out_time)}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Status</span>
                                        <span className={`summary-value ${getStatusBadge(todayAttendance.status).class}`}>
                                            {getStatusBadge(todayAttendance.status).label}
                                        </span>
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

export default AttendancePage;

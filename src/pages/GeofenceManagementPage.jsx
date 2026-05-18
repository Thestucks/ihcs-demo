import React, { useState, useEffect } from 'react';
import Navbar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/Sidebar';
import bgImg from '../assets/bg.png';
import '../styles/Dashboard.css';
import '../styles/GeofenceManagement.css';

// Simple map picker component for zone selection
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Zone marker icon
const zoneIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Map click handler component
function MapClickHandler({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        },
    });
    return null;
}

function GeofenceManagementPage() {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingZone, setEditingZone] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        zone_name: '',
        latitude: -6.2088,
        longitude: 106.8456,
        radius: 200,
        is_active: true
    });

    useEffect(() => {
        fetchZones();
    }, []);

    const fetchZones = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/admin/geofence-zones');
            const data = await response.json();
            if (data.success) {
                setZones(data.data || data.zones || []);
            }
        } catch (error) {
            console.error('Error fetching zones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMapClick = (latlng) => {
        setFormData(prev => ({
            ...prev,
            latitude: latlng.lat,
            longitude: latlng.lng
        }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddZone = () => {
        setEditingZone(null);
        setFormData({
            zone_name: '',
            latitude: -6.2088,
            longitude: 106.8456,
            radius: 200,
            is_active: true
        });
        setShowModal(true);
        setMessage({ type: '', text: '' });
    };

    const handleEditZone = (zone) => {
        setEditingZone(zone);
        setFormData({
            zone_name: zone.zoneName || zone.zone_name,
            latitude: parseFloat(zone.latitude),
            longitude: parseFloat(zone.longitude),
            radius: zone.radius,
            is_active: zone.isActive !== undefined ? zone.isActive : zone.is_active
        });
        setShowModal(true);
        setMessage({ type: '', text: '' });
    };

    const handleSaveZone = async () => {
        if (!formData.zone_name.trim()) {
            setMessage({ type: 'error', text: 'Nama zona harus diisi' });
            return;
        }

        try {
            const currentZoneId = editingZone ? (editingZone.zoneId || editingZone.zone_id) : null;
            if (editingZone && !currentZoneId) {
                setMessage({ type: 'error', text: 'ID Zona tidak valid' });
                return;
            }

            const url = editingZone
                ? `http://127.0.0.1:5000/api/admin/geofence-zones/${currentZoneId}`
                : 'http://127.0.0.1:5000/api/admin/geofence-zones';

            const payloadData = {
                zoneName: formData.zone_name,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                radius: parseInt(formData.radius, 10),
                isActive: Boolean(formData.is_active)
            };

            const response = await fetch(url, {
                method: editingZone ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadData)
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                fetchZones();
                setTimeout(() => {
                    setShowModal(false);
                    setMessage({ type: '', text: '' });
                }, 1500);
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan zona' });
        }
    };

    const handleDeleteZone = async (zoneId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus zona ini?')) return;

        try {
            const currentZoneId = zoneId.zoneId || zoneId.zone_id || zoneId;
            const response = await fetch(`http://127.0.0.1:5000/api/admin/geofence-zones/${currentZoneId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                fetchZones();
            }
        } catch (error) {
            console.error('Error deleting zone:', error);
        }
    };

    const toggleZoneStatus = async (zone) => {
        try {
            const currentZoneId = zone.zoneId || zone.zone_id;
            if (!currentZoneId) return;

            const currentIsActive = zone.isActive !== undefined ? zone.isActive : zone.is_active;

            const response = await fetch(`http://127.0.0.1:5000/api/admin/geofence-zones/${currentZoneId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    zoneName: zone.zoneName || zone.zone_name,
                    latitude: parseFloat(zone.latitude),
                    longitude: parseFloat(zone.longitude),
                    radius: parseInt(zone.radius, 10),
                    isActive: !currentIsActive
                })
            });
            const data = await response.json();
            if (data.success) {
                fetchZones();
            }
        } catch (error) {
            console.error('Error toggling zone status:', error);
        }
    };

    return (
        <div className="dashboard" style={{ backgroundImage: `url(${bgImg})` }}>
            <div className="dashboard-bg-shape shape-1"></div>
            <div className="dashboard-bg-shape shape-2"></div>

            <Navbar />
            <div className="dashboard-container">
                <Sidebar />
                <main className="main-content">
                    <div className="geofence-page">
                        <div className="page-header">
                            <h1 className="page-title">📍 Kelola Zona Geofence</h1>
                            <button className="btn-add-zone" onClick={handleAddZone}>
                                ➕ Tambah Zona Baru
                            </button>
                        </div>

                        {loading ? (
                            <p>Memuat...</p>
                        ) : (
                            <div className="zones-table-container">
                                <table className="zones-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama Zona</th>
                                            <th>Koordinat</th>
                                            <th>Radius (m)</th>
                                            <th>Status</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {zones.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                                    Belum ada zona geofence. Klik "Tambah Zona Baru" untuk menambahkan.
                                                </td>
                                            </tr>
                                        ) : (
                                            zones.map((zone, index) => {
                                                const currentZoneId = zone.zoneId || zone.zone_id;
                                                const currentZoneName = zone.zoneName || zone.zone_name;
                                                const currentIsActive = zone.isActive !== undefined ? zone.isActive : zone.is_active;

                                                return (
                                                    <tr key={currentZoneId}>
                                                        <td>{index + 1}</td>
                                                        <td>{currentZoneName}</td>
                                                        <td className="coord-cell">
                                                            {parseFloat(zone.latitude).toFixed(6)}, {parseFloat(zone.longitude).toFixed(6)}
                                                        </td>
                                                        <td>{zone.radius}</td>
                                                        <td>
                                                            <button
                                                                className={`status-toggle ${currentIsActive ? 'active' : 'inactive'}`}
                                                                onClick={() => toggleZoneStatus(zone)}
                                                            >
                                                                {currentIsActive ? '✅ Aktif' : '❌ Nonaktif'}
                                                            </button>
                                                        </td>
                                                        <td className="action-cell">
                                                            <button className="btn-edit" onClick={() => handleEditZone(zone)}>
                                                                ✏️
                                                            </button>
                                                            <button className="btn-delete" onClick={() => handleDeleteZone(currentZoneId)}>
                                                                🗑️
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Modal */}
                        {showModal && (
                            <div className="modal-overlay" onClick={() => setShowModal(false)}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <h2>{editingZone ? 'Edit Zona Geofence' : 'Tambah Zona Geofence'}</h2>
                                        <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                                    </div>

                                    {message.text && (
                                        <div className={`modal-message ${message.type}`}>
                                            {message.type === 'success' ? '✅' : '❌'} {message.text}
                                        </div>
                                    )}

                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label>Nama Zona</label>
                                            <input
                                                type="text"
                                                name="zone_name"
                                                value={formData.zone_name}
                                                onChange={handleInputChange}
                                                placeholder="Contoh: Kantor Pusat Jakarta"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Klik pada peta untuk memilih lokasi zona</label>
                                            <div className="map-picker">
                                                <MapContainer
                                                    center={[formData.latitude, formData.longitude]}
                                                    zoom={15}
                                                    style={{ height: '350px', width: '100%', borderRadius: '12px' }}
                                                >
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; OpenStreetMap contributors'
                                                    />
                                                    <MapClickHandler onLocationSelect={handleMapClick} />
                                                    <Marker
                                                        position={[formData.latitude, formData.longitude]}
                                                        icon={zoneIcon}
                                                    />
                                                    <Circle
                                                        center={[formData.latitude, formData.longitude]}
                                                        radius={parseInt(formData.radius)}
                                                        pathOptions={{
                                                            color: formData.is_active ? '#3b82f6' : '#9ca3af',
                                                            fillColor: formData.is_active ? '#3b82f6' : '#9ca3af',
                                                            fillOpacity: 0.2
                                                        }}
                                                    />
                                                </MapContainer>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Latitude</label>
                                                <input
                                                    type="number"
                                                    name="latitude"
                                                    value={formData.latitude}
                                                    onChange={handleInputChange}
                                                    step="0.000001"
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Longitude</label>
                                                <input
                                                    type="number"
                                                    name="longitude"
                                                    value={formData.longitude}
                                                    onChange={handleInputChange}
                                                    step="0.000001"
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Radius (meter)</label>
                                            <input
                                                type="number"
                                                name="radius"
                                                value={formData.radius}
                                                onChange={handleInputChange}
                                                min="50"
                                                max="5000"
                                                step="50"
                                            />
                                            <small>Range: 50 - 5000 meter</small>
                                        </div>

                                        <div className="form-group-checkbox">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="is_active"
                                                    checked={formData.is_active}
                                                    onChange={handleInputChange}
                                                />
                                                <span>Zona Aktif</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button className="btn-cancel" onClick={() => setShowModal(false)}>
                                            Batal
                                        </button>
                                        <button className="btn-save" onClick={handleSaveZone}>
                                            💾 {editingZone ? 'Update' : 'Simpan'} Zona
                                        </button>
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

export default GeofenceManagementPage;

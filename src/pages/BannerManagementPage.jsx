import React, { useState, useEffect } from 'react';
import Navbar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/Sidebar';
import '../styles/Dashboard.css';
import '../styles/Settings.css';

const BannerManagementPage = () => {
    const [banners, setBanners] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fetch banners
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/banners')
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                const bannersData = data.data || data;
                if (Array.isArray(bannersData)) {
                    setBanners(bannersData);
                } else {
                    console.error('Invalid banners data:', data);
                    setBanners([]);
                }
            })
            .catch(err => {
                console.error('Failed to fetch banners:', err);
                setBanners([]);
            });
    }, [refreshTrigger]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('banner', selectedFile);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/banners', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Banner uploaded successfully!');
                setSelectedFile(null);
                setPreviewUrl(null);
                setRefreshTrigger(prev => prev + 1);
            } else {
                alert('Failed to upload banner');
            }
        } catch (error) {
            console.error('Error uploading banner:', error);
            alert('Error uploading banner');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this banner?')) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/banners/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRefreshTrigger(prev => prev + 1);
            } else {
                alert('Failed to delete banner');
            }
        } catch (error) {
            console.error('Error deleting banner:', error);
            alert('Error deleting banner');
        }
    };

    const handleEdit = async (id, currentTitle) => {
        const newTitle = window.prompt('Masukkan nama banner baru:', currentTitle || '');
        if (newTitle === null) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/banners/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle })
            });

            if (response.ok) {
                setRefreshTrigger(prev => prev + 1);
            } else {
                alert('Gagal mengupdate banner');
            }
        } catch (error) {
            console.error('Error updating banner:', error);
            alert('Error updating banner');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard">
            <div className="dashboard-bg-shape shape-1"></div>
            <div className="dashboard-bg-shape shape-2"></div>
            <Navbar />
            <div className="dashboard-container">
                <Sidebar />
                <main className="main-content">
                    <div className="user-card" style={{ marginBottom: '2rem' }}>
                        <div className="user-card-header">
                            <div className="user-basic-info">
                                <h2 className="user-name">Banner Management</h2>
                                <p className="user-department">Manage images for the Dashboard carousel</p>
                            </div>
                        </div>

                        <div style={{ padding: '0 1.75rem 1.75rem' }}>
                            {/* Upload Section */}
                            <div style={{
                                background: 'rgba(255,255,255,0.5)',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                marginBottom: '2rem',
                                display: 'flex',
                                gap: '2rem',
                                alignItems: 'center'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Upload New Banner</h3>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="field-input"
                                            style={{ background: 'white' }}
                                        />
                                        <button
                                            className="btn-primary"
                                            onClick={handleUpload}
                                            disabled={!selectedFile || uploading}
                                            style={{ margin: 0, padding: '0.6rem 1.5rem', whiteSpace: 'nowrap' }}
                                        >
                                            {uploading ? 'Uploading...' : 'Upload Banner'}
                                        </button>
                                    </div>
                                </div>
                                {previewUrl && (
                                    <div style={{ width: '200px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </div>

                            {/* Banner Table */}
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Active Banners</h3>
                            <div className="users-table-container">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '50px' }}>No</th>
                                            <th style={{ width: '120px' }}>Gambar</th>
                                            <th>Nama Banner</th>
                                            <th>Tanggal Upload</th>
                                            <th style={{ width: '100px' }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {banners.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="no-data">Tidak ada banner yang diupload</td>
                                            </tr>
                                        ) : (
                                            banners.map((banner, index) => (
                                                <tr key={banner.bannerId || banner.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <img
                                                            src={banner.imageUrl ? `http://127.0.0.1:5000/uploads/banners/${banner.imageUrl}` : banner.url}
                                                            alt={banner.title || banner.originalName}
                                                            style={{
                                                                width: '100px',
                                                                height: '60px',
                                                                objectFit: 'cover',
                                                                borderRadius: '4px',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ fontWeight: 500 }}>{banner.title || banner.originalName}</td>
                                                    <td>{formatDate(banner.createdAt || banner.uploadedAt)}</td>
                                                    <td>
                                                        <button
                                                            className="btn-primary"
                                                            onClick={() => handleEdit(banner.bannerId || banner.id, banner.title || banner.originalName)}
                                                            title="Edit Banner"
                                                            style={{ marginRight: '8px', padding: '0.4rem 0.8rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            📝
                                                        </button>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => handleDelete(banner.bannerId || banner.id)}
                                                            title="Hapus Banner"
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
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BannerManagementPage;

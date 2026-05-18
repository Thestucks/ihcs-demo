import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const BirthdayCard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('workspace');
  const [searchQuery, setSearchQuery] = useState('');
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch birthdays from API
  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/birthdays`);
        const data = await response.json();

        if (data.success) {
          setBirthdays(data.data || []);
        } else {
          setError('Gagal memuat data ulang tahun');
        }
      } catch (err) {
        console.error('Error fetching birthdays:', err);
        setError('Gagal terhubung ke server');
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, []);

  // Format date to Indonesian format (e.g., "14 Januari")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Get days until text
  const getDaysUntilText = (daysUntil) => {
    if (daysUntil === 0) return 'Hari ini! 🎉';
    if (daysUntil === 1) return 'Besok';
    if (daysUntil <= 7) return `${daysUntil} hari lagi`;
    if (daysUntil <= 30) return `${Math.ceil(daysUntil / 7)} minggu lagi`;
    return `${Math.ceil(daysUntil / 30)} bulan lagi`;
  };

  // Filter data based on tab and search query
  const getFilteredData = () => {
    let filteredData = birthdays;

    // Filter by tab
    if (activeTab === 'workspace' && user) {
      // Show users in same department or unit
      filteredData = birthdays.filter(person =>
        (person.department && person.department === user.department) ||
        (person.unit && person.unit === user.unit)
      );
    }
    // 'employee' tab shows all birthdays

    // Filter by search query
    if (searchQuery.trim()) {
      filteredData = filteredData.filter(person =>
        person.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredData;
  };

  const currentData = getFilteredData();

  if (loading) {
    return (
      <div className="card birthday-card">
        <h4>Employee Birthday</h4>
        <div className="empty-state-small">
          <div className="empty-icon-small">⏳</div>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card birthday-card">
      <h4>Employee Birthday</h4>

      <div className="tabs">
        <button
          className={activeTab === 'workspace' ? 'active' : ''}
          onClick={() => setActiveTab('workspace')}
        >
          Workspace
        </button>
        <button
          className={activeTab === 'employee' ? 'active' : ''}
          onClick={() => setActiveTab('employee')}
        >
          Employee
        </button>
      </div>

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="🔍 Cari nama..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="birthday-content">
        {error ? (
          <div className="empty-state-small">
            <div className="empty-icon-small">❌</div>
            <p>{error}</p>
          </div>
        ) : currentData.length === 0 ? (
          <div className="empty-state-small">
            <div className="empty-icon-small">🎂</div>
            <p>Tidak ada data</p>
            <small>
              {searchQuery
                ? 'Tidak ditemukan hasil pencarian'
                : activeTab === 'workspace'
                  ? 'Tidak ada ulang tahun di workspace Anda'
                  : 'Belum ada data ulang tahun'}
            </small>
          </div>
        ) : (
          <div className="birthday-list">
            {currentData.map(person => (
              <div key={person.id} className="birthday-item">
                <div className="birthday-avatar">
                  <span>{person.daysUntil === 0 ? '🎉' : '🎂'}</span>
                </div>
                <div className="birthday-info">
                  <p className="birthday-name">{person.name}</p>
                  <small className="birthday-date">
                    {formatDate(person.tanggal_lahir)} • {getDaysUntilText(person.daysUntil)}
                  </small>
                  <small className="birthday-dept">
                    {person.department || person.unit || '-'}
                  </small>
                </div>
                <button className="birthday-wish-btn" title="Kirim Ucapan">
                  🎁
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayCard;

import React, { useState, useEffect } from 'react';

const MoodStats = () => {
  const [stats, setStats] = useState({
    positive: 15,
    neutral: 15,
    negative: 15
  });

  // Simulasi update data setiap 5 detik (bisa diganti dengan API call)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        positive: Math.floor(Math.random() * 30) + 10,
        neutral: Math.floor(Math.random() * 25) + 10,
        negative: Math.floor(Math.random() * 15) + 5
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const total = stats.positive + stats.neutral + stats.negative;
  const positivePercent = ((stats.positive / total) * 100).toFixed(1);
  const neutralPercent = ((stats.neutral / total) * 100).toFixed(1);
  const negativePercent = ((stats.negative / total) * 100).toFixed(1);

  return (
    <div className="card mood-card">
      <div className="mood-header">
        <h4>Hi-Coach</h4>
        <span className="mood-subtitle">Mood Karyawan Hari Ini</span>
      </div>
      
      <div className="mood-stats">
        <div className="mood-item">
          <div className="mood-icon positive">
            <span className="emoji">😊</span>
          </div>
          <span className="mood-count">{stats.positive}</span>
          <p className="mood-label">Positive</p>
          <small className="mood-percent">{positivePercent}%</small>
        </div>
        
        <div className="mood-item">
          <div className="mood-icon neutral">
            <span className="emoji">😐</span>
          </div>
          <span className="mood-count">{stats.neutral}</span>
          <p className="mood-label">Neutral</p>
          <small className="mood-percent">{neutralPercent}%</small>
        </div>
        
        <div className="mood-item">
          <div className="mood-icon negative">
            <span className="emoji">😞</span>
          </div>
          <span className="mood-count">{stats.negative}</span>
          <p className="mood-label">Negative</p>
          <small className="mood-percent">{negativePercent}%</small>
        </div>
      </div>

      <div className="mood-total">
        <small>Total Respon: <strong>{total}</strong></small>
      </div>
    </div>
  );
};

export default MoodStats;

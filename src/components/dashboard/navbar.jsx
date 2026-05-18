import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import lgnbImg from '../../assets/lgnb.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' });
      const dateFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
      setCurrentDateTime(`${timeFormatter.format(now).replace(':', '.')} | ${dateFormatter.format(now)}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-time">
          {currentDateTime}
        </span>
      </div>
      <div className="navbar-right">
        <button className="logout-btn" onClick={handleLogout}>
          🔓 Logout
        </button>
        <img src={lgnbImg} alt="lgnb" className="bank-logo" />
      </div>
    </nav>
  );
};

export default Navbar;

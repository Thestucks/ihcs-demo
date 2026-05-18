import React from 'react';
import Navbar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/Sidebar';
import UnderConstruction from '../components/UnderConstruction';
import bgImg from '../assets/bg.png';
import '../styles/Dashboard.css';

function TCadjustmentPage() {
  return (
    <div className="dashboard" style={{ backgroundImage: `url(${bgImg})` }}>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <UnderConstruction title="⚡ Penyesuaian TC" icon="⚡" />
        </main>
      </div>
    </div>
  );
}

export default TCadjustmentPage;

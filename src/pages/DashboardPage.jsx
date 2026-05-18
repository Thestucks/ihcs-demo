import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/navbar';
import Carousel from '../components/dashboard/Carousel';
import UseCard from '../components/dashboard/UseCard';
import TaskCard from '../components/dashboard/TaskCard';
import BirthdayCard from '../components/dashboard/BirthdayCard';
import { TaskProvider } from '../context/TaskContext';
import bgImg from '../assets/bg.png';
import '../styles/Dashboard.css';

function DashboardPage() {
  const [bannerImages, setBannerImages] = useState([]); // Default images

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/banners')
      .then(res => {
        console.log(res);
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(response => {
        console.log(response);
        if (response && response.data && response.data.length > 0) {
          setBannerImages(response.data.map(b => b.imageUrl ? `http://127.0.0.1:5000/uploads/banners/${b.imageUrl}` : b.url));
        }
      })
      .catch(err => console.error('Failed to fetch banners:', err));
  }, []);

  return (
    <TaskProvider>
      <div className="dashboard" style={{ backgroundImage: `url(${bgImg})` }}>
        {/* Background decorative shapes */}
        <div className="dashboard-bg-shape shape-1"></div>
        <div className="dashboard-bg-shape shape-2"></div>

        <Navbar />
        <div className="dashboard-container">
          <Sidebar />
          <main className="main-content">
            <Carousel images={bannerImages} />
            <div className="cards-grid">
              <UseCard />
              <TaskCard />
              <BirthdayCard />
            </div>
          </main>
        </div>
      </div>
    </TaskProvider>
  );
}

export default DashboardPage;

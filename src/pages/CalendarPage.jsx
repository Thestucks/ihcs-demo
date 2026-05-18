import React from 'react';
import Navbar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/Sidebar';
import Calendar from '../components/dashboard/Calendar';
import TaskList from '../components/dashboard/TaskList';
import { TaskProvider } from '../context/TaskContext';
import bgImg from '../assets/bg.png';
import '../styles/Dashboard.css';
import '../styles/LoginNew.css';

function CalendarPage() {
  return (
    <TaskProvider>
      <div className="dashboard" style={{ backgroundImage: `url(${bgImg})`, position: 'relative', overflow: 'hidden' }}>
        {/* Background decorative shapes */}
        <div className="login-bg-shape shape-2"></div>

        <Navbar />
        <div className="dashboard-container">
          <Sidebar />
          <main className="main-content calendar-page-main">
            <div className="calendar-task-wrapper">
              <div className="calendar-section">
                <Calendar />
              </div>
              <div className="task-section">
                <TaskList />
              </div>
            </div>
          </main>
        </div>
      </div>
    </TaskProvider>
  );
}

export default CalendarPage;

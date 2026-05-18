import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import EmployeeLoanMonitoringPage from './pages/EmployeeLoanMonitoringPage';
import EmployeeLoanProcessingPage from './pages/EmployeeLoanProcessingPage';
import PayrollManagementPage from './pages/PayrollManagementPage';
import RequestReportPage from './pages/RequestReportPage';
import AdjustmentAnnualBonusPage from './pages/AdjustmentAnnualBonusPage';
import TCadjustmentPage from './pages/TCadjustmentPage';
import BannerManagementPage from './pages/BannerManagementPage';
import AttendancePage from './pages/AttendancePage';
import AttendanceRecapPage from './pages/AttendanceRecapPage';
import AttendanceManagementPage from './pages/AttendanceManagementPage';
import GeofenceManagementPage from './pages/GeofenceManagementPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/geofence"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <GeofenceManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/banners"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BannerManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/attendance"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AttendanceManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/recap"
            element={
              <ProtectedRoute>
                <AttendanceRecapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/module/employee-loan/monitoring"
            element={
              <ProtectedRoute>
                <EmployeeLoanMonitoringPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/module/employee-loan/processing"
            element={
              <ProtectedRoute>
                <EmployeeLoanProcessingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/module/payroll"
            element={
              <ProtectedRoute>
                <PayrollManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/module/request-report"
            element={
              <ProtectedRoute>
                <RequestReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/module/annual-bonus"
            element={
              <ProtectedRoute>
                <AdjustmentAnnualBonusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/module/tc-adjustment"
            element={
              <ProtectedRoute>
                <TCadjustmentPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;

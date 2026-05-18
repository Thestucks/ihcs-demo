import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (newState) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  };

  useEffect(() => {
    // Initialize collapsed state on mount
    document.body.classList.add('sidebar-collapsed');
    
    // Cleanup body class on unmount
    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, []);

  useEffect(() => {
    // Set active menu berdasarkan current route
    if (location.pathname === '/profile') {
      setActiveMenu('profile');
    } else if (location.pathname === '/dashboard') {
      setActiveMenu('dashboard');
    } else if (location.pathname === '/calendar') {
      setActiveMenu('calendar');
    } else if (location.pathname === '/settings') {
      setActiveMenu('user-management'); 
      setExpandedMenu('settings'); 
      setExpandedSubMenu('settings');
    } else if (location.pathname === '/settings/banners') {
      setActiveMenu('banner-management');
      setExpandedMenu('settings');
      setExpandedSubMenu('settings');
    } else if (location.pathname.startsWith('/module/')) {
      setActiveMenu('module');
      setExpandedMenu('module');
    } else if (location.pathname === '/attendance') {
      setActiveMenu('checkin-checkout');
      setExpandedMenu('attendance');
    } else if (location.pathname === '/attendance/recap') {
      setActiveMenu('attendance-recap');
      setExpandedMenu('attendance');
    } else if (location.pathname === '/settings/attendance') {
      setActiveMenu('attendance-management');
      setExpandedMenu('settings');
      setExpandedSubMenu('settings');
    }
  }, [location.pathname]);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', route: '/dashboard' },
    { id: 'profile', icon: '👤', label: 'Profile', route: '/profile' },
    {
      id: 'module',
      icon: '📄',
      label: 'Module Management',
      route: '/module',
      submenu: [
        {
          id: 'employee-loan',
          label: 'Employee Loan Management',
          icon: '💰',
          hasSubmenu: true,
          items: [
            { id: 'loan-monitoring', label: 'Monitoring', route: '/module/employee-loan/monitoring' },
            { id: 'loan-processing', label: 'Processing', route: '/module/employee-loan/processing' }
          ]
        },
        {
          id: 'payroll',
          label: 'Payroll Management',
          icon: '💳',
          hasSubmenu: true,
          items: [
            { id: 'test-payroll', label: 'Payroll', icon: '💳', route: '/module/payroll' },
          ]
        },
        { id: 'request-report', label: 'Request Report', icon: '📋', route: '/module/request-report' },
        { id: 'annual-bonus', label: 'Adjustment Annual Bonus', icon: '🎁', route: '/module/annual-bonus' },
        { id: 'tc-adjustment', label: 'TC Adjustment', icon: '⚡', route: '/module/tc-adjustment' }
      ]
    },
    { id: 'calendar', icon: '📅', label: 'Calendar', route: '/calendar' },
    {
      id: 'attendance',
      icon: '⏰',
      label: 'Absensi',
      submenu: [
        { id: 'checkin-checkout', label: 'Check In / Out', icon: '✅', route: '/attendance' },
        { id: 'attendance-recap', label: 'Rekap Absensi', icon: '📊', route: '/attendance/recap' }
      ]
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: 'Settings',
      route: '/settings',
      adminOnly: true,
      submenu: [
        { id: 'user-management', label: 'User Management', icon: '👥', route: '/settings' },
        { id: 'banner-management', label: 'Banner Management', icon: '🖼️', route: '/settings/banners' },
        { id: 'attendance-management', label: 'Kelola Absensi', icon: '⏰', route: '/settings/attendance' },
        { id: 'geofence-management', label: 'Kelola Zona Geofence', icon: '📍', route: '/settings/geofence' }
      ]
    }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && !isAdmin()) {
      return false;
    }
    return true;
  });

  const handleMenuClick = (item) => {
    if (isCollapsed) {
      toggleSidebar();
    }

    if (item.submenu) {
      // If it was collapsed, naturally expand this submenu to show the user what's inside.
      // If it's already expanded, toggle normally.
      if (isCollapsed) {
        setExpandedMenu(item.id);
      } else {
        setExpandedMenu(expandedMenu === item.id ? null : item.id);
      }
    } else {
      setActiveMenu(item.id);
      navigate(item.route);
    }
  };

  const handleSubMenuClick = (subItem) => {
    if (subItem.hasSubmenu) {
      setExpandedSubMenu(expandedSubMenu === subItem.id ? null : subItem.id);
    } else {
      setActiveMenu(subItem.id);
      navigate(subItem.route);
    }
  };

  const handleSubSubmenuClick = (subSubItem) => {
    setActiveMenu(subSubItem.id);
    navigate(subSubItem.route);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-dark-rail"></div>
      
      <div className="sidebar-header">
        <button className="hamburger-btn" onClick={toggleSidebar}>≡</button>
      </div>

      <div className="sidebar-menu">
        {filteredMenuItems.map((item) => (
          <div key={item.id} className="sidebar-item-wrapper">
            <button
              className={`sidebar-icon ${activeMenu === item.id ? 'active' : ''} ${item.submenu ? 'has-submenu' : ''}`}
              onClick={() => handleMenuClick(item)}
              title={item.label}
            >
              <span className="icon-container">
                <span className="icon">{item.icon}</span>
              </span>
              <span className="label-container">
                <span className="label">{item.label}</span>
                {item.submenu && (
                  <span className={`expand-arrow ${expandedMenu === item.id ? 'expanded' : ''}`}>▼</span>
                )}
              </span>
            </button>

            {item.submenu && expandedMenu === item.id && (
              <div className="submenu">
                {item.submenu.map((subItem) => (
                  <div key={subItem.id} className="submenu-item-wrapper">
                    {subItem.hasSubmenu ? (
                      <>
                        <button
                          className={`submenu-parent-btn ${expandedSubMenu === subItem.id ? 'expanded' : ''}`}
                          onClick={() => handleSubMenuClick(subItem)}
                        >
                          <span className="submenu-icon">{subItem.icon}</span>
                          <span className="submenu-label">{subItem.label}</span>
                          <span className={`submenu-expand-arrow ${expandedSubMenu === subItem.id ? 'expanded' : ''}`}>▼</span>
                        </button>
                        {expandedSubMenu === subItem.id && (
                          <div className="submenu-nested">
                            {subItem.items.map((nestedItem) => (
                              <button
                                key={nestedItem.id}
                                className={`submenu-nested-item ${activeMenu === nestedItem.id ? 'active' : ''}`}
                                onClick={() => handleSubSubmenuClick(nestedItem)}
                              >
                                <span className="nested-dot">•</span>
                                <span>{nestedItem.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        className={`submenu-item ${activeMenu === subItem.id ? 'active' : ''}`}
                        onClick={() => handleSubMenuClick(subItem)}
                      >
                        <span className="submenu-icon">{subItem.icon}</span>
                        <span className="submenu-label">{subItem.label}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

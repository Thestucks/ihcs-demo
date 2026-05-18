import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  // Cek apakah user sudah login saat aplikasi dimuat
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') {
          setUser(parsed);
          setIsAuthenticated(true);

          // Automatically fetch latest profile data to refresh stale localStorage caches
          const userId = parsed.id || parsed.user_id || parsed.userId;
          if (userId) {
            // MOCK REFRESH BACKGROUND TANPA BACKEND
            console.log("Mock profile silent refresh");
          }
        } else {
          // Value was valid JSON but not a user object (e.g. null, number)
          localStorage.removeItem('user');
        }
      } catch (e) {
        // Value was not valid JSON (e.g. the string "undefined")
        console.warn('Clearing invalid user data from localStorage:', savedUser);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (ujang) => {
    try {
      setError('');
      // MOCK LOGIN TANPA BACKEND
      const mockUser = {
        id: 1,
        username: ujang.username,
        role: 'admin',
        name: 'Demo User',
        email: 'demo@ihcs.com'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (err) {
      setError('Gagal login (Mock)');
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError('');
    localStorage.removeItem('user');
  };

  // Function to update user data (for profile sync)
  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Function to refresh user profile from API
  const refreshUserProfile = async () => {
    const userId = user?.id || user?.user_id;
    if (!userId) return;

    try {
      // MOCK REFRESH USER PROFILE TANPA BACKEND
      console.log('Mock refresh user profile for ID:', userId);
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  // Helper function to check user role
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const hasRole = (roles) => {
    if (!user?.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser, refreshUserProfile, loading, error, isAdmin, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

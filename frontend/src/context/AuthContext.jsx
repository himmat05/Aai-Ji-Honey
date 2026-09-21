import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { customerAuthApi } from '../api/customerAuthApi';

const AuthContext = createContext(null);

// Inactivity timeout: 1 hour (60 minutes) of no user activity
const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  // Sync with localStorage across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token') || null);
      try {
        const stored = localStorage.getItem('user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch (e) {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('last_activity_time');
    setToken(null);
    setUser(null);
  }, []);

  // Inactivity auto-logout tracker (1 hour idle timeout)
  useEffect(() => {
    if (!token) return;

    // Check if session was already idle for > 1 hour
    const lastActive = parseInt(localStorage.getItem('last_activity_time'), 10);
    const now = Date.now();
    if (lastActive && now - lastActive > INACTIVITY_TIMEOUT_MS) {
      logout();
      toast.warn('⚠️ Your session expired due to 1 hour of inactivity. Please log in again.', {
        toastId: 'session-timeout',
      });
      return;
    }

    // Initialize last_activity_time if absent
    if (!lastActive) {
      localStorage.setItem('last_activity_time', String(now));
    }

    let lastRecorded = Date.now();
    const updateActivity = () => {
      const currentTime = Date.now();
      // Throttle localStorage writes to at most once every 10 seconds
      if (currentTime - lastRecorded > 10000) {
        lastRecorded = currentTime;
        localStorage.setItem('last_activity_time', String(currentTime));
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((evt) => window.addEventListener(evt, updateActivity, { passive: true }));

    // Periodic check every 15 seconds
    const interval = setInterval(() => {
      const recorded = parseInt(localStorage.getItem('last_activity_time'), 10) || lastRecorded;
      if (Date.now() - recorded > INACTIVITY_TIMEOUT_MS) {
        logout();
        toast.warn('⚠️ Your session expired due to 1 hour of inactivity. Please log in again.', {
          toastId: 'session-timeout',
        });
        const protectedPaths = ['/orderDashboard', '/orders', '/profile', '/admin'];
        if (protectedPaths.some((p) => window.location.pathname.startsWith(p))) {
          window.location.href = '/login';
        }
      }
    }, 15000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, updateActivity));
      clearInterval(interval);
    };
  }, [token, logout]);

  // Fetch / verify current profile if token exists but user profile is missing
  useEffect(() => {
    if (token && !user) {
      customerAuthApi
        .getMe()
        .then((data) => {
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        });
    }
  }, [token, logout]);

  const login = useCallback((newToken, userData = null) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('last_activity_time', String(Date.now()));
    setToken(newToken);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      // Fetch user profile immediately
      customerAuthApi
        .getMe()
        .then((data) => {
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        })
        .catch(() => {});
    }
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const isOwner = user?.role === 'owner' || user?.role === 'admin';
  const isAdmin = isOwner;
  const isCustomer = user?.role === 'user';

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    isOwner,
    isAdmin,
    isCustomer,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

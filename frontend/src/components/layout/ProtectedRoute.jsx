import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isAdmin, isOwner, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If this route strictly requires admin / store owner privileges
  if (requiredRole === 'admin') {
    const isUserAdmin = isAdmin || isOwner || user?.role === 'admin' || user?.role === 'owner';
    if (!isUserAdmin) {
      console.warn(`🚨 Unauthorized admin portal access attempt to ${location.pathname} by user: ${user?.email || 'unknown'}`);
      return <Navigate to="/profile" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

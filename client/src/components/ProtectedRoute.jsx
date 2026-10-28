import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken } from '../services/api';

const ProtectedRoute = () => {
  const token = getAuthToken();

  if (!token) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

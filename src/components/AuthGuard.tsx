import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard = () => {
  // TODO: Implement proper authentication check
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;

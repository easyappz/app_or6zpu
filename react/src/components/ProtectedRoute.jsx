import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const location = useLocation();
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div data-easytag="id3-src/components/ProtectedRoute.jsx" style={{ display: 'contents' }}>
      <Outlet />
    </div>
  );
}

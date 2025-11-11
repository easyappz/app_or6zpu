import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function hasToken() {
  try {
    return Boolean(localStorage.getItem('accessToken'));
  } catch (e) {
    return false;
  }
}

export default function ProtectedRoute() {
  const location = useLocation();
  const authed = hasToken();

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div data-easytag="id3-src/components/ProtectedRoute.jsx" style={{ display: 'contents' }}>
      <Outlet />
    </div>
  );
}

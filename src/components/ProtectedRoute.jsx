import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotAuthorized from '../pages/NotAuthorized';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { session, profile, loading } = useAuth();

  if (loading) {
      return (
          <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
              </div>
          </div>
      );
  }

  if (!session) return <Navigate to="/login" replace />;

  if (!profile) return <NotAuthorized />;

  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;

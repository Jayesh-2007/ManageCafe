import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ requiredRole, guestOnly }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (guestOnly) {
    if (isAuthenticated) {
      return <Navigate to={role === 'admin' ? '/reports' : '/pos'} replace />;
    }
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/pos" replace />;
  }

  return <Outlet />;
}

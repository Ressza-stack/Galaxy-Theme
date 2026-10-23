import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading...</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

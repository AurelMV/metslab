import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, userRole, loading } = useContext(AuthContext);

  if (loading) return null;

  // Si está logueado Y es admin, pasa. Si no, al lobby.
  return (isAuthenticated && userRole === 'admin') 
    ? <Outlet /> 
    : <Navigate to="/lobby" replace />;
};

export default AdminRoute;
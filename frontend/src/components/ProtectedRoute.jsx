import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Mientras el contexto verifica si hay un token en localStorage
  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  // Si no está autenticado, redirige al lobby
  // "replace" evita que el usuario pueda volver atrás a la página protegida
  return isAuthenticated ? <Outlet /> : <Navigate to="/lobby" replace />;
};

export default ProtectedRoute;
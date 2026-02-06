import { useContext, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch.js';

function Profile() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const token = localStorage.getItem('token');

  const { data: user, loading, execute: fetchMe } = useFetch(
    `${import.meta.env.VITE_API_URL}/me`, 'GET', null, false
  );

  useEffect(() => {
    fetchMe({ headers: { 'Authorization': `Bearer ${token}` } });
  }, []);

  const menuOptions = [
    { name: 'Mi Información', path: '/profile' },
    { name: 'Direcciones', path: '/profile/address'},
    { name: 'Métodos de Pago', path: '/profile/payments'},
    { name: 'Editar Perfil', path: '/profile/edit'},
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Lateral */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 bg-orange-50 text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h2 className="font-bold text-gray-800">{user?.name || 'Cargando...'}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            
            <nav className="p-4 space-y-1">
              {menuOptions.map((opt) => (
                <Link
                  key={opt.path}
                  to={opt.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    location.pathname === opt.path 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium text-sm">{opt.name}</span>
                </Link>
              ))}
              
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-4"
              >
                <span className="font-medium text-sm">Cerrar Sesión</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Contenido Central Dinámico */}
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-100">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <Outlet context={{ user }} /> /* Aquí se renderizan las opciones */
            )}
          </div>
        </main>

      </div>
    </div>
  );
}

export default Profile;
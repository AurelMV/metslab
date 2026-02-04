import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('No autenticado (401). El token es inválido o expiró.');
        } else {
          setError('Error al obtener perfil.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="login-box">
        <h1>Perfil</h1>

        {loading && <p>Cargando perfil...</p>}

        {error}

        {user && (
          <div>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <div style={{ marginTop: 16 }}>
              <button className="login-button" onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
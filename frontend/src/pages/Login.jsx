import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { AuthContext } from '../context/AuthContext.jsx';

function Login({ onLoginSuccess }) {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const { execute, loading, error: fetchError } = useFetch(`${import.meta.env.VITE_API_URL}/login`, 'POST', null, false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        if (!email.includes('@')) {
            setError('Por favor ingresa un email válido');
            return;
        }

        try {
            const data = await execute({ body: { email, password }, method: 'POST' });

            // Soportar diferentes nombres de token en la respuesta
            const token = data?.token || data?.access_token || data?.data?.token || data?.data?.access_token;
            const role = data?.user?.roles?.[0];

            if (token) {
                login(token, role);
                onLoginSuccess(true);
            } else {
                console.warn('No se encontró token en la respuesta:', data);
            }

        } catch (err) {
            // Preferir mensaje del servidor si existe
            const message = err?.response?.data?.message || err?.message || 'Error en el login';
            setError(message);
        }
    };

    return (
        <div className="">
            <div className="p-8 rounded-lg bg-white w-full max-w-md space-y-6">
                <h1 className='text-2xl font-bold text-center'>Inicia Sesión</h1>
                <form onSubmit={handleSubmit}>
                    <div className="">
                        <label htmlFor="email" className='block mb-2 text-left text-sm font-medium text-gray-700'>Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-4 flex flex-col">
                        <label htmlFor="password" className='block mb-2 mt-2 text-left text-sm font-medium text-gray-700'>Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {(error || fetchError) && (
                        <div className="text-red-500 rounded-md bg-red-100 p-2 m-2 mb-4 text-center">{error || (fetchError?.response?.data?.message || fetchError.message)}</div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="text-center">
                    <a href="#" className='text-blue-500'>¿Olvidaste tu contraseña?</a>
                    <span> | </span>
                    <a href="/register" className='text-blue-500'>Crear cuenta</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
import React, { useState } from 'react';
import useFetch from '../hooks/useFetch.js';


function Register({ onRegisterSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    // const [loading, setLoading] = useState(false);

    const { execute, loading, error: fetchError } = useFetch(`${import.meta.env.VITE_API_URL}/register`, 'POST', null, false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await execute(
                formSubmitted, 'POST'
            );

            if (response && response.success) {
                onRegisterSuccess(true);
            } else {
                setError(response?.message || 'Error al registrar usuario');
            }
        } catch (err) {
            setError('Error de conexión');
        }
    };

    
    return (
        <div className="">
            <div className="p-8 rounded-lg bg-white w-full max-w-md space-y-6">
                <h1 className='text-2xl font-bold text-center'>MetsLab</h1>
                <form onSubmit={handleSubmit}>

                    <div>
                        <label htmlFor="name" className='block mb-2 text-sm font-medium text-gray-700'>Nombre</label>
                        <input
                            id="name"
                            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            type="text"
                            placeholder="Tu nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div >
                        <label htmlFor="email" className='block mb-2 mt-2 text-sm font-medium text-gray-700'>Email</label>
                        <input
                            id="email"
                            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className='block mb-2 mt-2 text-sm font-medium text-gray-700'>Contraseña</label>
                        <input
                            id="password"
                            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className='block mb-2 mt-2 text-sm font-medium text-gray-700'>Confirmar Contraseña</label>
                        <input
                            id="password_confirmation"
                            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            type="password"
                            placeholder="••••••••"
                            value={password_confirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {(error || error) && (
                        <div className="text-red-500 rounded-md bg-red-100 p-2 m-2 text-center">{error || (error?.response?.data?.message || error.message)}</div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 mt-4 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {loading ? 'Cargando...' : 'Registrarse'}
                    </button>
                </form>

                <div className="login-footer">
                    <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
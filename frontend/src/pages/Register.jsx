import React, { useState } from 'react';
import useFetch from '../hooks/useFetch.js';


function Register({ onRegisterSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    // const [loading, setLoading] = useState(false);

    const { execute, loading, error: fetchError } = useFetch(`${import.meta.env.VITE_API_URL}/register`, 'POST', null, false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !name || !password_confirmation) {
            setError('Por favor completa todos los campos');
            return;
        }

        if (!email.includes('@')) {
            setError('Por favor ingresa un email válido');
            return;
        }

        const dataToSubmit = {
            name,
            email,
            password,
            password_confirmation
        };

        try {
            const response = await execute({ body: dataToSubmit, method: 'POST' });

            if (response) {
                onRegisterSuccess(true);
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || 'Error en el registro';
            setError(message);
        }
    };


    return (
        <div className="">
            <div className="p-8 rounded-lg bg-white w-full max-w-md space-y-6">
                <h1 className='text-2xl font-bold text-center'>Registrate</h1>
                <form onSubmit={handleSubmit}>

                    <div>
                        <label htmlFor="name" className='block mb-2 text-left text-sm font-medium text-gray-700'>Nombre</label>
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
                        <label htmlFor="email" className='block mb-2 mt-2 text-sm text-left font-medium text-gray-700'>Email</label>
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
                        <label htmlFor="password" className='block mb-2 mt-2 text-left text-sm font-medium text-gray-700'>Contraseña</label>
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
                        <label htmlFor="password_confirmation" className='block mb-2 mt-2 text-left text-sm font-medium text-gray-700'>Confirmar Contraseña</label>
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

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                            disabled={loading}
                        />
                        <label htmlFor="terms" className='ml-2 text-sm text-gray-600'>Acepto los términos y condiciones</label>
                    </div>

                    {(error || fetchError) && (
                        <div className="text-red-500 rounded-md bg-red-100 p-2 m-2 text-center">{error || fetchError?.response?.data?.message || fetchError.message}</div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-orange-500 mt-4 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                        {loading ? 'Cargando...' : 'Registrarse'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <a>¿Ya tienes cuenta? </a>
                    <a href="/login" className='text-blue-500'>Inicia sesión</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
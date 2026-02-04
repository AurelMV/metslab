import React, { useState } from 'react';


function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation,
                }),
            });

            if (response.ok) {
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                window.location.href = '/login';
            } else {
                const data = await response.json();
                setError(data.message || 'Error al registrar usuario');
            }
        } catch (err) {
            setError('Error de conexión');
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>MetsLab</h1>
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Tu nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_confirmation">Confirmar Contraseña</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            placeholder="••••••••"
                            value={password_confirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {(error || error) && (
                        <div className="error-message">{error || (error?.response?.data?.message || error.message)}</div>
                    )}

                    <button type="submit" disabled={loading} className="login-button">
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
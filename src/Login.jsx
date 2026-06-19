import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Loader2, Leaf } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api/client';
import config from './config';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post(config.endpoints.login, {
        username,
        password,
      });

      const data = response.data;

      // Caso A: sesión completa, correo ya verificado
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || {
            _id: data.userId || data.id,
            username: username,
            role: 'user'
        }));
        navigate('/home');
        return;
      }

      // Caso B: falta verificar correo → guardamos pendingToken y vamos a la pantalla
      if (data.pendingVerification && data.pendingToken) {
        localStorage.setItem('pendingToken', data.pendingToken);
        if (data.email) localStorage.setItem('pendingEmail', data.email);
        else localStorage.removeItem('pendingEmail');
        if (data.userId) localStorage.setItem('pendingUserId', data.userId);
        navigate('/verificar-correo');
        return;
      }

      setError('El servidor no devolvió un token de acceso.');
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError(
          'Tiempo de espera agotado. Comprueba que el servidor esté encendido y la URL correcta.'
        );
      } else if (!err.response) {
        setError(
          'No se pudo conectar al servidor. Revisa que el backend esté en ejecución y la URL en config.'
        );
      } else {
        setError(err.response.data?.message || 'Credenciales inválidas.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center p-4 box-border"
      style={{ background: 'var(--eva-bg)' }}
    >
      <div
        className="eva-card w-full max-w-[420px] p-10 box-border"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="mb-10 flex flex-col items-center">
          <div
            className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{ background: 'var(--eva-primary-light)' }}
          >
            <Leaf size={40} style={{ color: 'var(--eva-primary)' }} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--eva-text)' }}>
            EVA<span style={{ color: 'var(--eva-primary)' }}>.</span>
          </h1>
          <p className="mt-2 text-base font-medium" style={{ color: 'var(--eva-text-muted)' }}>
            Inicia sesión en tu panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="rounded-xl border px-4 py-3 text-center text-sm font-semibold"
              style={{
                background: 'var(--eva-danger-light)',
                borderColor: 'var(--eva-danger)',
                color: 'var(--eva-danger)',
              }}
            >
              {error}
            </div>
          )}

          <div className="w-full">
            <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--eva-text)' }}>
              Usuario
            </label>
            <div className="relative w-full">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                size={20}
                style={{ color: 'var(--eva-text-muted)' }}
              />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
                className="eva-input w-full pl-11 pr-4 py-3 box-border"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--eva-text)' }}>
              Contraseña
            </label>
            <div className="relative w-full">
              {/* Botón del ojo movido al lado izquierdo */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80 z-10"
                style={{ color: 'var(--eva-text-muted)', background: 'none', border: 'none', padding: 0 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="eva-input w-full pl-12 pr-4 py-3 box-border"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="eva-btn-primary w-full py-4 text-base disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="mx-auto animate-spin" size={24} />
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm" style={{ color: 'var(--eva-text-muted)' }}>
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="font-semibold transition-colors hover:underline"
            style={{ color: 'var(--eva-primary)' }}
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
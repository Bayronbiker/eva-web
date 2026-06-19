import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, UserPlus, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import api from './api/client';
import config from './config';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    email: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Debes ingresar un correo electrónico válido');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(config.endpoints.register, {
        username: formData.username,
        password: formData.password,
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
      });

      const data = response.data;

      // Nuevo flujo: el backend devuelve pendingToken y manda el código por correo.
      if (data.pendingToken) {
        localStorage.setItem('pendingToken', data.pendingToken);
        if (data.email) localStorage.setItem('pendingEmail', data.email);
        if (data.userId) localStorage.setItem('pendingUserId', data.userId);
        setSuccess('Te enviamos un código de verificación a tu correo.');
        setTimeout(() => navigate('/verificar-correo'), 800);
        return;
      }

      // Compatibilidad con backend antiguo
      if (data.message === 'Registro exitoso') {
        setSuccess('Registro correcto. Redirigiendo al inicio de sesión...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Error en el registro');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center p-4 py-10"
      style={{ background: 'var(--eva-bg)' }}
    >
      <div
        className="eva-card w-full max-w-[440px] p-8"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="mb-8 flex flex-col items-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'var(--eva-primary-light)' }}
          >
            <Leaf size={32} style={{ color: 'var(--eva-primary)' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--eva-text)' }}>
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--eva-text-muted)' }}>
            Regístrate en EVA
          </p>
        </div>

        {error && (
          <div
            className="mb-5 rounded-xl border px-4 py-3 text-sm font-semibold"
            style={{
              background: 'var(--eva-danger-light)',
              borderColor: 'var(--eva-danger)',
              color: 'var(--eva-danger)',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="mb-5 rounded-xl border px-4 py-3 text-sm font-semibold"
            style={{
              background: 'var(--eva-primary-light)',
              borderColor: 'var(--eva-primary)',
              color: 'var(--eva-primary)',
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'nombre', label: 'Nombre completo', icon: User, placeholder: 'Tu nombre completo' },
            { name: 'username', label: 'Usuario *', icon: User, placeholder: 'Elige un nombre de usuario', required: true },
            { name: 'email', label: 'Email *', icon: Mail, placeholder: 'tu@email.com', type: 'email', required: true },
            { name: 'telefono', label: 'Teléfono', icon: Phone, placeholder: '300 123 4567', type: 'tel' },
          ].map(({ name, label, icon: Icon, placeholder, required, type = 'text' }) => (
            <div key={name}>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--eva-text)' }}>
                {label}
              </label>
              <div className="relative">
                <Icon
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  size={18}
                  style={{ color: 'var(--eva-text-muted)' }}
                />
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required={required}
                  className="eva-input pl-11 py-2.5"
                />
              </div>
            </div>
          ))}

          <div>
            <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--eva-text)' }}>
              Contraseña *
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2"
                size={18}
                style={{ color: 'var(--eva-text-muted)' }}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                className="eva-input pl-11 py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--eva-text)' }}>
              Confirmar contraseña *
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2"
                size={18}
                style={{ color: 'var(--eva-text-muted)' }}
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
                className="eva-input pl-11 py-2.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="eva-btn-primary mt-2 flex w-full items-center justify-center gap-2 py-4 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <UserPlus size={20} />
                Crear cuenta
              </>
            )}
          </button>
        </form>

        <p className="mt-6 border-t pt-6 text-center text-sm" style={{ borderColor: 'var(--eva-border)', color: 'var(--eva-text-muted)' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-semibold transition-colors hover:underline" style={{ color: 'var(--eva-primary)' }}>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

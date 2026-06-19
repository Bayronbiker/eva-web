import axios from 'axios';
import config from '../config';

const client = axios.create({
  baseURL: config.API_URL,
  timeout: config.REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
});

// ── REQUEST: elige el token correcto según la ruta ───────────────────────────
// Para las rutas /auth/email/* usamos el pendingToken (corto, sin emailVerified).
// Para todo lo demás usamos el token de sesión completo.
client.interceptors.request.use((req) => {
  const esRutaVerificacion = typeof req.url === 'string' && req.url.includes('/auth/email/');
  const token = esRutaVerificacion
    ? (localStorage.getItem('pendingToken') || localStorage.getItem('token'))
    : localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ── RESPONSE: maneja globalmente el 403 EMAIL_NOT_VERIFIED ───────────────────
// Cuando el backend devuelve este error en cualquier ruta protegida, significa
// que el JWT es válido pero el usuario aún no ha verificado su correo. Limpiamos
// el token de sesión y redirigimos a la pantalla de verificación. La ruta de
// verificación misma queda excluida para no entrar en bucle.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const codigo = err?.response?.data?.code;
    const url    = err?.config?.url || '';
    const esRutaVerificacion = url.includes('/auth/email/');

    if (status === 403 && codigo === 'EMAIL_NOT_VERIFIED' && !esRutaVerificacion) {
      // Guardamos el email (si vino) para prefillarlo en la pantalla de verificación.
      const email = err.response.data?.email;
      if (email) localStorage.setItem('pendingEmail', email);

      // El JWT viejo no sirve para datos pero el backend NO emitió pendingToken aquí,
      // así que forzamos un re-login: limpiamos sesión y enviamos al login.
      localStorage.removeItem('token');
      // Solo redirigimos si no estamos ya en una ruta pública para evitar parpadeos.
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register' && path !== '/verificar-correo') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default client;

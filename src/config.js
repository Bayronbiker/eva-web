// URL base del API (servidor Ubuntu). Para producción cambia VITE_API_URL en .env
const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://192.168.1.108:5000/api',
  REQUEST_TIMEOUT_MS: 20000, // 20 segundos para evitar que la página se quede cargando

  endpoints: {
    login: '/login',
    register: '/register',
    profile: '/user/profile',
    facturas: '/facturas',
    clientes: '/clientes',
    movimientos: '/movimientos',
    resumen: '/resumen',
    remisiones: "/remisiones",
    cotizaciones: "/cotizaciones"
  }
};

export default config;
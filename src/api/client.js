import axios from 'axios';
import config from '../config';

const client = axios.create({
  baseURL: config.API_URL,
  timeout: config.REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
});

// Añadir token a las peticiones si existe
client.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default client;

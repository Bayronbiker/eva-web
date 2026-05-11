import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
// Ya no necesitamos importar CrearFactura aquí, Home se encargará de ello.
// import CrearFactura from './components/facturas/CrearFactura';
import VerFactura from './components/facturas/VerFactura';
import EditarFactura from './components/facturas/EditarFactura';

// Páginas legales públicas (no requieren login)
// Se enlazan desde la app Android y desde Play Store
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import Terms from './components/legal/Terms';
import About from './components/legal/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── PÁGINAS LEGALES PÚBLICAS ────────────────────────────────────
            Sin ProtectedRoute: son accesibles desde la app Android y desde
            el listing de Play Store sin necesidad de iniciar sesión. */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms"   element={<Terms />} />
        <Route path="/about"   element={<About />} />

        {/* RUTA PRINCIPAL PROTEGIDA */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/*
          1. CAMBIO: Se eliminó la ruta "/facturas/nueva".
          La lógica para crear facturas ahora está centralizada en el componente Home.jsx,
          lo que garantiza que siempre se use la función onSave que se conecta con Axios y el backend.
          Esto soluciona el error "400 Bad Request" porque el Home.jsx es quien sabe cómo
          enviar los datos correctamente.
        */}

        {/* Rutas de facturas existentes (Ver y Editar) */}
        <Route path="/facturas/:id" element={
          <ProtectedRoute requiredRole="contador">
            <VerFactura />
          </ProtectedRoute>
        } />
        <Route path="/facturas/editar/:id" element={
          <ProtectedRoute requiredRole="contador">
            <EditarFactura />
          </ProtectedRoute>
        } />

        {/* Ruta por defecto: si no encuentra nada, redirige a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

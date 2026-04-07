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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

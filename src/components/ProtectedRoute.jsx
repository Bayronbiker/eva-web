import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const validateToken = () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setIsValid(false);
          return;
        }

        // El backend puede no incluir role en el token; si no está, tratamos como 'user'
        const userRole = decoded.role || 'user';
        const roleHierarchy = { admin: 3, contador: 2, user: 1 };
        const requiredLevel = roleHierarchy[requiredRole] || 1;
        const userLevel = roleHierarchy[userRole] || 1;

        if (userLevel < requiredLevel) {
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      } catch (error) {
        console.error('Error decodificando token:', error);
        localStorage.removeItem('token');
        setIsValid(false);
      }
    };

    validateToken();
  }, [token, requiredRole]);

  if (isValid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--eva-bg)' }}>
        <div
          className="h-12 w-12 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: 'var(--eva-primary)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
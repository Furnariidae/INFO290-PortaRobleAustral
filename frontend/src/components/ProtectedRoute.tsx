import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  redirectPath?: string; // Ruta de redirección por defecto
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  children,
  redirectPath = "/admin"
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Controlar la navegación hacia atrás utilizando un evento de popstate
    const handlePopState = (event: PopStateEvent) => {
      if (window.location.pathname === '/admin/panel' && isAuthenticated) {
        event.preventDefault(); // Prevenir la navegación hacia atrás

        // Mostrar la alerta de cierre de sesión
        alert('Debe cerrar sesión primero.');

        // Eliminar la autenticación local
        localStorage.removeItem('isAuthenticated');
        
        // Redirigir al login
        navigate('/admin', { replace: true });
      }
    };

    // Agregar el evento de retroceso
    window.addEventListener('popstate', handlePopState);

    // Cleanup al desmontar el componente
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated, navigate]);

  // Si el usuario está autenticado, muestra el contenido de la ruta protegida
  // Si no está autenticado, redirige al login
  return isAuthenticated ? <>{children}</> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;

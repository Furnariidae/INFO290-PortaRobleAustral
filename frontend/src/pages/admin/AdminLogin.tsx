import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import './AdminLogin.css';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (localStorage.getItem('isAuthenticated') === 'true') {
        alert('Debe cerrar sesión primero.');
        navigate('/admin/panel', { replace: true });
      }
    };

    // Registrar el evento al montar el componente
    window.addEventListener('popstate', handlePopState);

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requestBody = {
      username,
      password,
    };
    try {
      // Realizar la solicitud POST con fetch
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Comprobar si la respuesta fue exitosa
      if (response.ok) {
        const data = await response.json();

        // Guardar el token o cualquier dato necesario en localStorage o estado
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin/panel', { replace: true });
        setLoading(false);
        onLoginSuccess(); 
      } else {
        const errorData = await response.json();
        setLoading(false);
        setError(errorData.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      setLoading(false);
      setError('Ocurrió un error. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="admin-login-container">
      <video autoPlay loop muted className="background-video">
        <source src="/login_admin/videoroble.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      <div className="login-box">
        <img src="/login_admin/logo_login.png" alt="Logo" className="login-logo" />
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button-container">
            <button type="submit">Ingresar</button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="navigate-container">
        <button className="navigate-link" onClick={() => navigate('/inicio')}>
          <FaArrowRight className="icon-arrow" /> ir a RobleAustral
        </button>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Iniciando sesión...</p>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;

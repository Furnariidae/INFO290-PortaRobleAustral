// ErrorPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './css/ErrorPage.css';

const ErrorPage: React.FC = () => {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>La página que buscas no se encontró.</p>
      <p>Es posible que la URL esté incorrecta o que la página haya sido eliminada.</p>
      <Link to="/" className="home-link">Volver a la página principal</Link>
    </div>
  );
};

export default ErrorPage;

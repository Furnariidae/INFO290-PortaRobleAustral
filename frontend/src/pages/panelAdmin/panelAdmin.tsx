import React, { useState, useEffect } from 'react';
import "./panelAdmin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlusCircle, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const InicioAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Sesión cerrada');
  }


  function removeAccents(text: string): string{
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  const opciones = [
    "Proyecto",
    "Trabajo de Título",
    "Práctica",
    "Artículo",
    "Colaboración",
    "Noticia",
    "Integrante",
    // "Administrador",
    "Institución"
  ];

  /* const handleLogout = () => {
    setLoading(true); // Iniciar el estado de carga

    // Simula el retraso de cierre de sesión con setTimeout
    setTimeout(() => {
      localStorage.removeItem('isAuthenticated');
      setLoading(false); // Finalizar el estado de carga
      navigate('/inicio'); // Redirigir al login o la página principal
    }, 2000); // 2 segundos de retraso para simular la carga
  }; */

  useEffect(() => {
    const handlePopState = () => {
      if (!localStorage.getItem('isAuthenticated')) {
        alert('Debe iniciar sesión primero.');
        navigate('/inicio', { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup al desmontar el componente
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');

      
      setLoading(false);
      navigate('/inicio', { replace: true });
    }, 2000);
  };
  
  

  const handleNavigate = (action: string, option: string) => {
    const route = `/admin/${action}/${removeAccents(option.toLowerCase().replace(/ /g, "-"))}`;
    navigate(route);
    window.scrollTo(0, 0);
  };

  return (
    <div className="inicio-admin">
      <h1>Panel de Administración</h1>
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} className="margin-icon" />
            Cerrar Sesión
        </button>
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Cerrando sesión...</p>
        </div>
      )}

      <div className="grid-container">
        {opciones.map((opcion, index) => (
          <div className="card-admin" key={index}>
            <h2>{opcion}</h2>
            <div className="actions-admin">
              <button
                className="boton-nuevo"
                onClick={() => handleNavigate("nuevo", opcion)}
              >
                <FontAwesomeIcon icon={faPlusCircle} className="margin-icon" />
                Nuevo/a
              </button>
              <button
                className="boton-modificar"
                onClick={() => handleNavigate("editar", opcion)}
              >
                <FontAwesomeIcon icon={faPenToSquare} className="margin-icon" />
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InicioAdmin;

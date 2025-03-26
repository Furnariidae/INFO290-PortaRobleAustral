import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './NoticiasDetalle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faX, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../utils/dateUtils';
import { Noticia } from "../interfaces"

const NoticiaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); // Estado para el índice de la imagen actual

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleEventClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!id) {
      setError('No se proporcionó un ID válido');
      setLoading(false);
      return;
    }

    const fetchArticleById = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${apiUrl}/noticias/${id}`);
        if (!response.ok) throw new Error('Error al cargar el artículo');
        const data = await response.json();
        setNoticia(data);
      } catch (error: any) {
        setError(error.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleById();
  }, [id]);

  const nextImage = () => {
    if (noticia?.imagenes && currentImageIndex < noticia.imagenes.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (noticia?.imagenes && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!noticia) {
    return <div>No se encontró la noticia</div>;
  }

  return (
    <div className="noticia-detalle">
      <div className="noticia-header">
        {/* Carrusel de imágenes */}
        <div className="noticia-carrusel">
          {noticia.imagenes.length > 1 && (
            <button className="carrusel-btn prev" onClick={prevImage}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          )}
          <img
            src={noticia.imagenes[currentImageIndex]}
            alt={`${noticia.titulo} - Imagen ${currentImageIndex + 1}`}
            className="noticia-imagen"
          />
          {noticia.imagenes.length > 1 && (
            <button className="carrusel-btn next" onClick={nextImage}>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
        </div>

        {/* Indicadores del carrusel */}
        {noticia.imagenes.length > 1 && (
          <div className="carrusel-indicadores">
            {noticia.imagenes.map((_, index) => (
              <span
                key={index}
                className={`carrusel-indicador ${currentImageIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              ></span>
            ))}
          </div>
        )}

        <div className="noticia-info">
          <FontAwesomeIcon
            style={{ marginRight: 'auto', marginLeft: '10px', cursor: 'pointer' }}
            icon={faX}
            onClick={handleEventClose}
          />
          <h1 className="noticia-titulo">{noticia.titulo}</h1>
          <div className="noticia-meta">
            <p className="noticia-fecha">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span className="margin-icon">Fecha: {formatDate(noticia.fecha)}</span>
            </p>
            <p className="noticia-autor">
              <FontAwesomeIcon icon={faUser} />
              <span className="margin-icon">Autor: {noticia.autor}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="noticia-cuerpo">
        {noticia.cuerpo.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
  
};


export default NoticiaDetalle;

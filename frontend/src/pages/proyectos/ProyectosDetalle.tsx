import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProyectosDetalle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faHourglassHalf, faCalendarAlt, faX, faArrowRightLong, faLink, faArrowUpRightFromSquare, faFilePdf} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import ReadIcon from "../../components/iconos/Read";
import UserIcon from "../../components/iconos/Participantes";
import InstIcon from "../../components/iconos/Instituciones";
import Carousel3D from "../../components/Carousel3D";
import {formatDate} from "../../utils/dateUtils"
import { Proyecto } from "../interfaces";

const ProyectoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiUrl =
  process.env.REACT_APP_API_URL 

  const handleEventClose = () => {
    navigate(-1); // Navegar a la página anterior
  };

  const handleGoToQuienesSomos = (nombre: string) => {
    navigate(`/quienes_somos?participante=${encodeURIComponent(nombre)}`); // Navegar pasando el nombre del participante como parámetro
  };

  useEffect(() => {
    if (!id) {
      setError("No se proporcionó un ID válido");
      setLoading(false);
      return;
    }
  
    const fetchArticleById = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${apiUrl}/proyectos/${id}`);
        if (!response.ok) throw new Error("Error al cargar el artículo");
        const data = await response.json();
        setProyecto(data);

        console.log(proyecto?.galeria_imagenes);
      } catch (error: any) {
        console.error(error);
        setError(error.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
  
    fetchArticleById();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!proyecto || loading) {
    return <div>Cargando...</div>;
  }

  // Lógica para mostrar el ícono correcto según el estado
  const renderEstadoIcon = () => {
    switch (proyecto.estado) {
      case "Terminado":
        return <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />;
      case "En proceso":
        return <FontAwesomeIcon icon={faHourglassHalf} style={{ color: 'gray' }} />;
      case "No terminado":
        return <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />;
      default:
        return null;
    }
  };

  // Función para mensaje dinámico, dependiendo del estado del proyecto
  const renderEstadoText = () => {
    return proyecto.estado;
  };


  return (
    <div className="proyecto-detalle">
      <FontAwesomeIcon icon={faX} className="fa-x" onClick={handleEventClose} title="Cerrar"/>

      <h1>{proyecto.titulo}</h1>
      <div className="info-superior">
        <div className="estado-container">
          {renderEstadoIcon()}
          <span>{renderEstadoText()}</span>
        </div>
        <div className="fecha-container">
          <div className="fecha-inicio">
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>{formatDate(proyecto.fecha_inicio)}</span>
          </div>
          {proyecto.fecha_fin && ( // Mostrar solo si existe fecha_fin
            <div className="fecha-fin">
              <FontAwesomeIcon icon={faArrowRightLong} />
              <span>{formatDate(proyecto.fecha_fin)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="galeria-resumen-container">
        <div className="galeria-container">
          <Carousel3D galeria_imagenes={proyecto.galeria_imagenes} />
        </div>
        <div className="cuerpo-container">
          {/* <h2><ReadIcon/> Resumen</h2> */}
          <h2 className="title-container"> Resumen
            <span className="icon"><ReadIcon width="28px" height="28px" />
            </span>
          </h2>
          <p>{proyecto.cuerpo}</p>
        </div>
      </div>

      <div className="acciones">
        {proyecto.url_github && (
          <a href={proyecto.url_github} className="github-boton" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} /> GitHub
          </a>
        )}

        {proyecto.pdf && (
          <a
            title="Enviar correo electrónico"
            href={`mailto:robleaustral@inf.uach.cl?subject=Solicitud%20de%20PDF%20-%20${encodeURIComponent(proyecto.titulo)}&body=Estimado%20equipo%20de%20RobleAustral%2C%0A%0AHe%20leído%20el%20resumen%20sobre%20el%20proyecto%20${encodeURIComponent(proyecto.titulo)}%20y%20me%20gustaría%20solicitar%20el%20documento%20para%20leerlo%20completo.%0A%0AAtentamente%2C%0A%5BNombre%5D`}
            className="solicitar-pdf"
          >
            <FontAwesomeIcon icon={faFilePdf} /> Solicitar PDF
          </a>
        )}
        

        {proyecto.url_proyecto && (
          <a href={proyecto.url_proyecto} className="visitar-sitio-boton" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLink} /> Sitio Web
          </a>
        )}


      </div>

      <div className="participantes">
        <h2 className="title-container">Participantes <span className="icon"><UserIcon width="28px" height="28px" /></span></h2>
        <div className="personas-grid">
          {proyecto.participantes.map((p, index) => (
            <div key={index} className="persona">
              {p}
              <FontAwesomeIcon 
                icon={faArrowUpRightFromSquare} 
                className="link-icon" 
                onClick={() => handleGoToQuienesSomos(p)} // Pasar el nombre del participante
                title="Ver en Nuestro Equipo" 
                style={{ cursor: "pointer", marginLeft: "10px" }} 
              />
            </div>
          ))}
        </div>
      </div>

      <div className="instituciones">
        <h2 className="title-container">Instituciones
          <span className="icon"><InstIcon width="28px" height="28px" /></span>
        </h2>
        <div className="instituciones-grid">
          {proyecto.instituciones.map((i, index) => (
            <div key={index} className="institucion">
              <img src={i.imagen} alt={i.nombre} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProyectoDetalle;

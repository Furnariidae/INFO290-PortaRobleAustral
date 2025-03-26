import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PracticaDetalle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faHourglassHalf, faCalendarAlt, faX, faArrowUpRightFromSquare, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import ReadIcon from "../../components/iconos/Read";
import UserIcon from "../../components/iconos/Participantes";
import InstIcon from "../../components/iconos/Instituciones";
import Carousel3D from "../../components/Carousel3D";
import {formatDate} from "../../utils/dateUtils"
import { Practica, PracticaDetalleProps } from "../interfaces"

const PracticaDetalle: React.FC<PracticaDetalleProps> = ({ tipo }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const apiUrl =
  process.env.REACT_APP_API_URL 
  const [practica, setPractica] = useState<Practica | null>(null);
  //const [currentIndex, setCurrentIndex] = useState(0); // carousel

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
        const response = await fetch(`${apiUrl}/practicas/${id}`);
        if (!response.ok) throw new Error("Error al cargar el artículo");
        const data = await response.json();
        setPractica(data);
        console.log("ijsdfnkajkndfsa");

        console.log(practica?.galeria);
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
  if (!practica || loading) {
    return <div>Cargando...</div>;
  }


  const renderEstadoIcon = () => {
    if (practica.estado === "Finalizada") {
      return <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />;
    } else if (practica.estado === "En progreso") {
      return <FontAwesomeIcon icon={faHourglassHalf} style={{ color: 'gray' }} />;
    } else if (practica.estado === "No terminada") {
      return <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />;
    }
  };

  const renderEstadoText = () => {
    if (practica.estado === "Finalizada") {
      return "Finalizada";
    } else if (practica.estado === "En progreso") {
      return "En progreso";
    } else {
      return "No terminada";
    }
  };

  return (
    <div className="practica-detalle">
      <FontAwesomeIcon icon={faX} className="fa-x" onClick={handleEventClose} title="Cerrar"/>
      <h1>{practica.nombre}</h1>
      <div className="info-superior">
        <div className="estado-container">
          {renderEstadoIcon()}
          <span>{renderEstadoText()}</span>
        </div>
        <div className="fecha-container">
          <div className="fecha-inicio">
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>{formatDate(practica.fechaIni)}</span>
          </div>
          <div className="fecha-fin">
            <FontAwesomeIcon icon={faArrowRightLong} />
            <span>{formatDate(practica.fechaFin)}</span>
          </div>
        </div>
      </div>
      <div className="galeria-resumen-container">
        <div className="galeria-container">
          <Carousel3D galeria_imagenes={practica.galeria} />
        </div>
        <div className="cuerpo-container">
          {/* <h2><ReadIcon/> Resumen</h2> */}
          <h2 className="title-container"> Resumen
            <span className="icon"><ReadIcon width="28px" height="28px" />
            </span>
          </h2>
          <p>{practica.resumen}</p>
        </div>
      </div>
      <div className="participantes">
        <h2 className="title-container">Participantes <span className="icon"><UserIcon width="28px" height="28px" /></span></h2>
        <div className="personas-grid">
          {practica.participantes.map((p, index) => (
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
        <h2 className="title-container">Instituciones <span className="icon"><InstIcon width="28px" height="28px" /></span></h2>
        <div className="instituciones-grid">
          {practica.instituciones.map((i, index) => (
            <div key={index} className="institucion">
              <img src={i.imagen} alt={i.nombre} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticaDetalle;

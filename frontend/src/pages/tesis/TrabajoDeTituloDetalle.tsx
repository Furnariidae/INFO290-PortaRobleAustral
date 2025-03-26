import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './tesisDetalle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faHourglassHalf, faCalendarAlt, faDownload, faX, faArrowUpRightFromSquare, faArrowRightLong, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import UserIcon from "../../components/iconos/Participantes";
import InstIcon from "../../components/iconos/Instituciones";
import ReadIcon from "../../components/iconos/Read";
import Carousel3D from "../../components/Carousel3D";
import {formatDate} from "../../utils/dateUtils"
import { Tesis, TesisDetalleProps } from "../interfaces"

const TesisDetalle: React.FC<TesisDetalleProps> = ({ tipo }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tesis, setTesis] = useState<Tesis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleEventClose = () => {
    navigate(-1);
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
      const response = await fetch(`${apiUrl}/tesis/${id}`);
      if (!response.ok) throw new Error("Error al cargar el artículo");
      const data = await response.json();
      setTesis(data);

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
      return <p>Error: {error}</p>;
  }
  if (!tesis || loading) {
    return <div>Cargando...</div>;
  }

  const renderEstadoIcon = () => {
    if (tesis.estado === "Finalizada") {
      return <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />;
    } else if (tesis.estado === "En progreso") {
      return <FontAwesomeIcon icon={faHourglassHalf} style={{ color: 'gray' }} />;
    } else if (tesis.estado === "No terminada") {
      return <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />;
    }
  };

  const renderEstadoText = () => {
    if (tesis.estado === "Finalizada") {
      return "Finalizada";
    } else if (tesis.estado === "En progreso") {
      return "En progreso";
    } else {
      return "No terminada";
    }
  };

  return (
    <div className="tesis-detalle">
      <FontAwesomeIcon icon={faX} className="fa-x" onClick={handleEventClose} title="Cerrar"/>
      <h1>{tesis.titulo}</h1>

      <div className="info-superior">
        <div className="estado-container">
          {renderEstadoIcon()}
          <span>{renderEstadoText()}</span>
        </div>

        <div className="fecha-container">
          <div className="fecha-inicio">
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>{formatDate(tesis.fecha_inicio)}</span>
          </div>
          <div className="fecha-fin">
            <FontAwesomeIcon icon={faArrowRightLong} />
            <span>{formatDate(tesis.fecha_fin)}</span>
          </div>
</div>

      </div>

      <div className="galeria-resumen-container">
        <div className="galeria-container">
          <Carousel3D galeria_imagenes={tesis.galeria_imagenes} />
        </div>
        <div className="cuerpo-container">
          {/* <h2><ReadIcon/> Resumen</h2> */}
          <h2 className="title-container"> Resumen
            <span className="icon"><ReadIcon width="28px" height="28px" />
            </span>
          </h2>
          <p>{tesis.resumen}</p>
        </div>
      </div>

      <div className="acciones">
        {tesis.carta_de_apoyo && (
          <a href={tesis.carta_de_apoyo} download="carta.pdf" className="carta-apoyo">
            <FontAwesomeIcon icon={faDownload} /> Carta de apoyo
          </a>
        )}

        {tesis.pdf && (
          <a  
            title="Enviar correo electrónico"
            href={`mailto:robleaustral@inf.uach.cl?subject=Solicitud%20de%20PDF%20-%20${encodeURIComponent(tesis.titulo)}&body=Estimado%20equipo%20de%20RobleAustral%2C%0A%0AHe%20leído%20el%20resumen%20sobre%20el%20trabajo%20de%20título%20${encodeURIComponent(tesis.titulo)}%20y%20me%20gustaría%20solicitar%20el%20documento%20para%20leerlo%20completo.%0A%0AAtentamente%2C%0A%5BNombre%5D`}
            className="solicitar-pdf"
          >
            <FontAwesomeIcon icon={faFilePdf} /> Solicitar PDF
          </a>
        )}


        {tesis.url_github && (
          <a href={tesis.url_github} className="github-boton" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} /> Github
          </a>
        )}
      </div>


      <div className="participantes">
        <h2 className="title-container">Participantes <span className="icon"><UserIcon width="28px" height="28px" /></span></h2>
        <div className="personas-grid">
          {tesis.participantes.map((p, index) => (
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

      <div className="participantes">
        <h2 className="title-container">Patrocinantes <span className="icon"><UserIcon width="28px" height="28px" /></span></h2>
        <div className="personas-grid">
          {tesis.patrocinantes.map((p, index) => (
            <div key={index} className="persona">{p}</div>
          ))}
        </div>
      </div>

      <div className="participantes">
        <h2 className="title-container">Copatrocinantes <span className="icon"><UserIcon width="28px" height="28px" /></span></h2>
        <div className="personas-grid">
          {tesis.copatrocinantes.map((p, index) => (
            <div key={index} className="persona">{p}</div>
          ))}
        </div>
      </div>

      <div className="instituciones">
        <h2 className="title-container">Instituciones <span className="icon"><InstIcon width="28px" height="28px" /></span></h2>
        <div className="instituciones-grid">
          {tesis.instituciones.map((i, index) => (
            <div key={index} className="institucion">
              <img src={i.imagen} alt={i.nombre} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TesisDetalle;

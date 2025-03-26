import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ArticuloDetalle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faHourglassHalf, faCalendarAlt, faDownload, faX, faArrowRightLong, faArrowUpRightFromSquare, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import ReadIcon from "../../components/iconos/Read";
import UserIcon from "../../components/iconos/Participantes";
import InstIcon from "../../components/iconos/Instituciones";
import Carousel3D from "../../components/Carousel3D";
import {formatDate} from "../../utils/dateUtils"
import { Articulo } from "../interfaces";

const ArticuloDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Usamos useParams para obtener el ID de la ruta
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const apiUrl = process.env.REACT_APP_API_URL || "http://tu_api_url_por_defecto"; // Asegúrate de tener una URL por defecto

  const handleEventClose = () => {
    navigate(-1); // Navegar a la página anterior
  };

  const handleGoToQuienesSomos = (nombre: string) => {
    navigate(`/quienes_somos?participante=${encodeURIComponent(nombre)}`); // Navegar pasando el nombre del participante como parámetro
  };
  
  const fetchArticleById = async () => {
    if (!id) {
      setError("No se proporcionó un ID válido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/articulos/${id}`);
      if (!response.ok) throw new Error("Error al cargar el artículo");
      const data = await response.json();
      console.log(data);
      setArticulo(data); // Asumiendo que la API devuelve el artículo directamente
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Ejecuta el efecto cuando cambia el ID

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!articulo) {
    return <div>No se encontró el artículo</div>;
  }

  const renderEstadoIcon = () => {
    switch (articulo.estado) {
      case "Terminado":
        return (
          <FontAwesomeIcon icon={faCheckCircle} style={{ color: "green" }} />
        );
      case "En proceso":
        return (
          <FontAwesomeIcon icon={faHourglassHalf} style={{ color: "gray" }} />
        );
      case "No terminado":
        return (
          <FontAwesomeIcon icon={faTimesCircle} style={{ color: "red" }} />
        );
      default:
        return null;
    }
  };

  const renderEstadoText = () => {
    switch (articulo.estado) {
      case "Terminado":
      case "En proceso":
      case "No terminado":
        return articulo.estado;
      default:
        return "Estado desconocido";
    }
  };


  return (
    <div className="articulo-detalle">
      {/* <FontAwesomeIcon style={{ marginRight: 'auto', marginLeft: "10px", cursor: "pointer" }} icon={faX} onClick={handleEventClose} /> */}
      <FontAwesomeIcon
        icon={faX}
        className="fa-x"
        onClick={handleEventClose}
        title="Cerrar"
      />
      <h1>{articulo.titulo}</h1>
      <div className="info-superior">
        <div className="estado-container">
          {renderEstadoIcon()}
          <span>{renderEstadoText()}</span>
        </div>
        <div className="fecha-container">
          <div className="fecha-inicio">
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>{formatDate(articulo.fechaIni)}</span>
          </div>
          <div className="fecha-fin">
            <FontAwesomeIcon icon={faArrowRightLong} />
            <span>{formatDate(articulo.fechaFin)}</span>
          </div>
        </div>
      </div>

      <div className="galeria-resumen-container">
        <div className="galeria-container">
          <Carousel3D galeria_imagenes={articulo.galeria} />
        </div>
        <div className="cuerpo-container">
          {/* <h2><ReadIcon/> Resumen</h2> */}
          <h2 className="title-container">
            {" "}
            Resumen
            <span className="icon">
              <ReadIcon width="28px" height="28px" />
            </span>
          </h2>
          <p>{articulo.cuerpo}</p>
        </div>
      </div>

      <div className="acciones">
        {articulo.pdf && (
          <a
            title="Enviar correo electrónico"
            href={`mailto:robleaustral@inf.uach.cl?subject=Solicitud%20de%20PDF%20-%20${encodeURIComponent(articulo.titulo)}&body=Estimado%20equipo%20de%20RobleAustral%2C%0A%0AHe%20leído%20el%20resumen%20sobre%20el%20artículo%20${encodeURIComponent(articulo.titulo)}%20y%20me%20gustaría%20solicitar%20el%20documento%20para%20leerlo%20completo.%0A%0AAtentamente%2C%0A%5BNombre%5D`}
            className="solicitar-pdf"
          >
            <FontAwesomeIcon icon={faFilePdf} /> Solicitar PDF
          </a>
        )}
        
        
        {articulo.carta_de_apoyo && (
          <a
            href={articulo.carta_de_apoyo}
            download="carta.pdf"
            className="carta-apoyo"
          >
            <FontAwesomeIcon icon={faDownload} /> Carta de Apoyo
          </a>
        )}
        {articulo.url_github && (
          <a
            href={articulo.url_github}
            className="github-boton"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faGithub} /> Github
          </a>
        )}
      </div>

      <div className="participantes">
        <h2 className="title-container">Participantes <span className="icon"><UserIcon width="28px" height="28px" /></span></h2>
        <div className="personas-grid">
          {articulo.participantes.map((p, index) => (
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
        <h2 className="title-container">
          {" "}
          Instituciones
          <span className="icon">
            <InstIcon width="28px" height="28px" />
          </span>
        </h2>

        <div className="instituciones-grid">
          {articulo.instituciones?.map(
            (i: { nombre: string; imagen: string }, index: number) => (
              <div key={index} className="institucion">
                <img src={i.imagen} alt={i.nombre} />
                {/* Otro contenido */}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticuloDetalle;

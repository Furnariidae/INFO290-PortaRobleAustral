import React from 'react';
import "./css/TesisPracticas.css"; // Archivo CSS para los estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPenToSquare, faCheckCircle, faTimesCircle, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

// Lógica para mostrar el ícono correcto según el estado
const renderEstadoIcon = (estado: string) => {
  if (estado === "Finalizada") {
    return <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />;
  } else if (estado === "En progreso") {
    return <FontAwesomeIcon icon={faHourglassHalf} style={{ color: 'gray' }} />;
  } else if (estado === "No terminada") {
    return <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />;
  }
};

// Componente reutilizable
interface TesisPractica {
  id: string;
  titulo: string;
  resumen: string;
  autor: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: string;
  imagenes: string[];
  direccion: string;
  tipo?: string;
}


const TesisPracticaCard: React.FC<TesisPractica> = ({ id, titulo, resumen, autor, fecha_inicio, fecha_fin,  estado, imagenes, direccion, tipo }) => {
  const navigate = useNavigate();

  const handleVerMas = (id: string) => {
    navigate(`/${direccion}/${id}`);
  };

  return (
    <div className="TPCard_Container">
      <div className="section">
        <div className="card-tesis">
          {tipo &&
            <span className='tipo'>{tipo}</span>
          }
          <h3 className="card-title">{titulo}</h3>
     

          {imagenes.length > 0 && (
            <div className="imagenes-container">
              {imagenes.slice(0, 6).map((img, idx) => (
                <img key={idx} src={img} alt={`Imagen ${idx + 1}`} className="tesis-image" />
              ))}
            </div>
          )}

          <p className="card-summary">{resumen}</p>
          <div className="card-info-tesis">
            <span>
              <FontAwesomeIcon icon={faPenToSquare} />
              <span className="card-author">{autor}</span>
            </span>
            <span>
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span className="card-date">{fecha_inicio} - {fecha_fin}</span>
            </span>

          </div>
          <div className="card-status-button">
            <span>
              {renderEstadoIcon(estado)}
              <span className="card-status">{estado}</span>
            </span>
            <button className="ver-detalle-button" onClick={() => handleVerMas(id)}>Ver detalles</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TesisPracticaCard;
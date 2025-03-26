// src/components/Card.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import './css/Card.css';  // Puedes mover el CSS relevante aquí
import {formatDate} from "../utils/dateUtils"

interface CardProps {
  titulo: string;
  imagen: string;
  autor: string;
  fecha: string;
  resumen: string;
  cuerpo: string;
  onVerMas: () => void;
  title:string;
}

const Card: React.FC<CardProps> = ({ titulo, imagen, autor, fecha, resumen, onVerMas, title }) => {
    return (
    <div className="card" title={title} onClick={onVerMas}>
      <h1 className="title">{titulo}</h1>
      <div>
        <img src={imagen} alt={titulo} className="image" />
      </div>

      <div className="card-info">
        <span>
          <FontAwesomeIcon icon={faPenToSquare} />
          <span className="author">{autor}</span>
        </span>
        <span>
          <FontAwesomeIcon icon={faCalendarAlt} />
          <span className="date">{formatDate(fecha)}</span>
        </span>
      </div>

      <p className="description">{resumen}</p>
    </div>
  );
};

export default Card;

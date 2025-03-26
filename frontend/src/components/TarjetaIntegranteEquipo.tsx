import React from 'react';
import './css/TarjetaIntegranteEquipo.css';
import { FaLinkedin, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

// Definimos los tipos de las props
interface TarjetaIntegranteEquipoProps {
    id: string
    nombre: string;
    profesion: string;
    correo: string;
    linkedin: string;
    fecha: string;
    imagen: string;
    index: number;
    className?: string; // Hacemos que className sea opcional
}

const TarjetaIntegranteEquipo: React.FC<TarjetaIntegranteEquipoProps> = ({id,  nombre, profesion, correo, linkedin, fecha, imagen, className, index }) => {
    return (
        <div className={`miembro_equipo-card ${className || ''}`} key={index}>
            <div className="profile-pic"><img src={imagen} alt="foto perfil" /></div>
            <div className="miembro_equipo-info">
                <h2>{nombre}</h2>
                <p>{profesion}</p>
                <div className="redes-sociales">
                    <a href={linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={24} />
                    </a>
                    <a href={`mailto:${correo}`}>
                        <FaEnvelope size={24} />
                    </a>
                </div>
                <div className="fecha">
                    <FaCalendarAlt size={16} />
                    <span>{fecha}</span>
                </div>
            </div>
        </div>
    );
};

export default TarjetaIntegranteEquipo;

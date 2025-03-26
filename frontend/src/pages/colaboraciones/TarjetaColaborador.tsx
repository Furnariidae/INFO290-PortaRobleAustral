import React from 'react';
import { Email, Language } from '@mui/icons-material';
import './PaginaColaboraciones.css';

interface Link {
  correo?: string;
  web?: string;
}

interface TarjetaColaboradorProps {
  nombre: string;
  fecha_ini: string;
  fecha_fin: string;
  index: number;
  image: string;
  links: Link[];
}

const TarjetaColaborador: React.FC<TarjetaColaboradorProps> = ({ nombre, fecha_ini, fecha_fin, index, image, links }) => {
  return (
    <div className="tarjetaColaborador">
      <img src={image} alt={`${nombre}`} />
      <div className="tarjetaColaborador_Fechas">
        {fecha_ini && (
          <div>
            <p>Inicio</p>
            <p>{fecha_ini}</p>
          </div>
        )}
        {fecha_fin && (
          <div>
            <p>Fin</p>
            <p>{fecha_fin}</p>
          </div>
        )}
      </div>
      <div className="tarjetaColaborador_Links">
        {links.map((linkObj, idx) => (
          <button key={idx} className='colaboraciones_linkButton'>
            {linkObj.correo && (
              <a href={`mailto:${linkObj.correo}`} className="icono-correo">
                <Email style={{ fontSize: 24 }} />
              </a>
            )}
            {linkObj.web && (
              <a href={linkObj.web} target="_blank" rel="noopener noreferrer" className="icono-link">
                <Language style={{ fontSize: 24 }} />
              </a>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TarjetaColaborador;

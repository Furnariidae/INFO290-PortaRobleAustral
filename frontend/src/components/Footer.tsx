import React from 'react';
import CopyRight from './iconos/Copyright';
import './css/Footer.css';

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <p style={{ display: 'inline-flex', alignItems: 'center' }}>
          <CopyRight width={16} height={16} style={{ marginRight: '4px' }} /> 
          2024 RobleAustral, Inc.
        </p>
        <div className="rounded-social-buttons">
          {/* <a className="social-button instagram" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a> */}
          <a className="social-button outlook" href={`mailto:robleaustral@inf.uach.cl?subject=Contacto%20con%20RobleAustral&body=Estimado%20equipo%20de%20RobleAustral%2C%0A%0A%5BPor%20favor%20ingrese%20su%20mensaje%20aquí%5D%0A%0AAtentamente%2C%0A%5BNombre%5D`}>
            <i className="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;



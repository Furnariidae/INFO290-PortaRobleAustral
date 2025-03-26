import React, { useState } from 'react';
import './css/Carousel3D.css';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface Carousel3DProps {
  galeria_imagenes: string[];
}

const Carousel3D: React.FC<Carousel3DProps> = ({ galeria_imagenes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < galeria_imagenes.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const isSingleImage = galeria_imagenes.length <= 1;

  return (
    <div className="carousel-wrapper">
      <div className="carousel-container">
        {galeria_imagenes.map((imagen, index) => {
          const position =
            (index - currentIndex + galeria_imagenes.length) %
            galeria_imagenes.length;
          return (
            <div
              className="carousel-item"
              key={index}
              style={{
                zIndex: galeria_imagenes.length - position,
                opacity: position === 0 ? 1 : 0,
              }}
            >
              <img src={imagen} alt={`Galería Imagen ${index + 1}`} />
            </div>
          );
        })}
      </div>

      {/* Indicadores */}
      {!isSingleImage && (
        <div className="carousel-indicators">
          {galeria_imagenes.map((_, index) => (
            <span
              key={index}
              className={`indicator ${
                currentIndex === index ? 'active' : ''
              }`}
            ></span>
          ))}
        </div>
      )}

      {/* Botones de navegación */}
      {!isSingleImage && (
        <div className="carousel-buttons">
          <Button
            className="carousel-button"
            shape="circle"
            icon={<LeftOutlined />}
            onClick={handlePrev}
          />
          <Button
            className="carousel-button"
            shape="circle"
            icon={<RightOutlined />}
            onClick={handleNext}
          />
        </div>
      )}
    </div>
  );
};

export default Carousel3D;

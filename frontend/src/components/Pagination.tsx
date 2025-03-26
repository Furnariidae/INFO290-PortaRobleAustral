// Pagination.tsx
import React from 'react';
import './css/Pagination.css'; // Importa un archivo CSS para estilos si es necesario

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo(0, 0); // Desplazar hacia arriba
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo(0, 0); // Desplazar hacia arriba
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
    window.scrollTo(0, 0); // Desplazar hacia arriba
  };

  return (
    <div className="pagination">
      <button className="pagination-button" onClick={handlePrevPage} disabled={currentPage === 1}>
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          onClick={() => handlePageClick(index + 1)}
        >
          {index + 1}
        </button>
      ))}
      <button className="pagination-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
        &gt;
      </button>
    </div>
  );
};

export default Pagination;

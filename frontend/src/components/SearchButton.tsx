import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import "./css/SearchButton.css";

// Función para generar el slug desde el título
const createSlug = (title: string) => {
  return title
    .normalize("NFD") // Normaliza el texto a su forma descompuesta
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .toLowerCase() 
    .replace(/[^\w\s]/gi, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-');    // Reemplazar espacios por guiones
};

interface SearchButtonProps {
  onSearch: (query: string) => void;
  results: any[]; // Lista de resultados que se mostrarán
}

const SearchButton: React.FC<SearchButtonProps> = ({ onSearch, results }) => {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Ejecuta la búsqueda en tiempo real
  };

  const handleSelectItem = (item: any) => {
    const slug = createSlug(item.titulo); // Genera el slug basado en el título

    // Redirigir dependiendo del tipo de elemento
    if (item.url_proyecto) {
      navigate(`/proyectos/${slug}`);
    } else if (item.url_noticia) {
      navigate(`/noticias/${slug}`);
    }

    setIsSearchOpen(false); // Cierra la búsqueda después de seleccionar
  };

  return (
    <div className="search-container" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      {isSearchOpen && (
        <>
          <input
            className={`search_input ${isSearchOpen ? 'open' : ''}`}
            type="text"
            placeholder="Búsqueda por título..."
            value={query}
            onChange={handleSearch}
          />
          {results.length > 0 && (
            <ul className="search-results" style={{ position: 'absolute', top: '40px', right: '0', backgroundColor: 'white', zIndex: '100', listStyle: 'none' }}>
              {results.map((result) => (
                <li 
                  key={result.titulo} 
                  style={{ padding: '5px', cursor: 'pointer' }}
                  onClick={() => handleSelectItem(result)} // Redirige al proyecto o noticia
                >
                  {result.titulo}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <button onClick={handleSearchToggle} style={{ alignSelf: "center", height: "40px" }}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </div>
  );
};

export default SearchButton;

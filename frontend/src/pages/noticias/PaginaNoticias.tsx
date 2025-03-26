import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaginaNoticias.css';
import Card from '../../components/Card';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Noticia } from "../interfaces"

const PaginaNoticias: React.FC = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const articlesPerPage = 6;
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [searchParams, setSearchParams] = useSearchParams();
  // Extraer la página actual desde la URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  const fetchArticles = async (page: number) => {
    try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${apiUrl}/noticias/?page=${page}`);
        if (!response.ok) throw new Error('Error al cargar los artículos');
        const data = await response.json();
        console.log(data);
        setNoticias(data.noticias || []); // Acceder a los artículos dentro de la clave 'articulos'
        setTotalPages(Math.ceil(data.total / articlesPerPage)); // Ajuste en total para que use la cantidad total de artículos
    } catch (error: any) {
        console.error(error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
      return <p>Error: {error}</p>;
  }



  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    // setCurrentPage(page);
    setSearchParams({ page: page.toString() }); // Actualiza la URL
    window.scrollTo(0, 0);
  };

  const handleVerMas = (id: string) => {
    navigate(`/noticias/${id}`);
  };

  return (
    <div className="Noticias_Container">
      <div className="section">
        <div className="grid">
          {noticias.map((noticia, index) => (
            <Card
              key={index}
              titulo={noticia.titulo}
              imagen={noticia.imagenes[0]}
              autor={noticia.autor}
              fecha={noticia.fecha}
              cuerpo={noticia.cuerpo}
              resumen={noticia.resumen}
              onVerMas={() => handleVerMas(noticia.id)} // Cambiado para pasar el título y generar el slug
              title="Ver más"
            />
          ))}
        </div>
      </div>
      
      <Stack className='paginacion_mui' spacing={2}>
        <Pagination 
        count={totalPages} 
        page={currentPage}
        onChange={handleChangePage}
        size="medium"
        shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default PaginaNoticias;

import React, { useState,useEffect } from 'react';
import PostgradoCard from '../../components/TesisPracticasCard';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "./tesis.css"
import {formatDate} from "../../utils/dateUtils"
import { Tesis } from "../interfaces"

const TrabajoDeTituloPostgrado: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const trabajosPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [trabajos, setTrabajos] = useState<Tesis[]>([]);

  // Función para cambiar de página
  const handleChangePage = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const fetchTrabajos = async (page: number) => {
    try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${apiUrl}/tesis/postgrado/?page=${page}`);
        if (!response.ok) throw new Error('Error al cargar los artículos');
        const data = await response.json();
        console.log(data);
        setTrabajos(data.articulos || []);
        setTotalPages(Math.ceil(data.total / trabajosPerPage));
    } catch (error: any) {
        console.error(error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrabajos(currentPage);
  }, [currentPage]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
      return <p>Error: {error}</p>;
  }

  return (
    <div className="Postgrado_Container">
      <h2 className="Tesis_Title">Postgrado</h2>
      <div className="Tesis_Grid">
        {trabajos.map((item, index)=>(
          <PostgradoCard 
            key={index}
            id={item.id.toString()}
            titulo={item.titulo}
            resumen={item.resumen}
            autor={item.autor[0]}
            fecha_inicio={formatDate(item.fecha_inicio)}
            fecha_fin={formatDate(item.fecha_fin)}
            estado={item.estado}
            imagenes={item.galeria_imagenes}
            direccion="tesis"
            tipo={item.tipo}
          />
        ))}
      </div>

      <Stack className='paginacion_mui' spacing={2}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
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

export default TrabajoDeTituloPostgrado;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import InicialCard from '../../components/TesisPracticasCard';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "./Practicas.css"
import {formatDate} from "../../utils/dateUtils"
import { Practica } from "../interfaces"

const PracticasIniciales: React.FC = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 3; // Número de elementos por página, puedes ajustarlo
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [totalPages, setTotalPages] = useState(1);
  const [practicas, setPracticas] = useState<Practica[]>([]);

  // Leer la página actual desde la URL o usar 1 como predeterminado
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Función para cambiar de página
  const handleChangePage = (_event: React.ChangeEvent<unknown>, page: number) => {
    // setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  };

  const fetchArticles = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/practicas/iniciales/?page=${page}`);
      if (!response.ok) throw new Error('Error al cargar los artículos');
      const data = await response.json();
      console.log(data);

      const totalItems = data.total || 0;
      setPracticas(data || []); 
      setTotalPages(Math.max(1,Math.ceil(totalItems / itemsPerPage)));
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
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (loading) {
    return <div>Cargando...</div>;
  }


  return (
    <div className="Practicas_Container">
      <h2 className="Practicas_Title">Iniciales</h2>
      <div className="Practicas_Grid">
        {practicas.map((item, index) => {
          return (
            <InicialCard
              key={index}
              id={item.id}
              titulo={item.nombre}
              resumen={item.resumen}
              autor={item.participantes.map(participante => participante).join(', ')}
              fecha_inicio={formatDate(item.fechaIni)}
              fecha_fin={formatDate(item.fechaFin)}
              estado={item.estado}
              imagenes={item.galeria}
              direccion="practicas"
              tipo={item.tipo}
            />
          );
        })}
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

export default PracticasIniciales;
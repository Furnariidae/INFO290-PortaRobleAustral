import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaginaProyectos.css';
import Card from '../../components/Card';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Proyecto } from "../interfaces";

const PaginaProyectos: React.FC = () => {
    const articlesPerPage = 6;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [proyectos, setNoticias] = useState<Proyecto[]>([]);
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    // Extraer la página actual desde la URL
    const currentPage = parseInt(searchParams.get("page") || "1", 10);


    const fetchArticles = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${apiUrl}/proyectos/?page=${page}`);
            if (!response.ok) throw new Error('Error al cargar los artículos');
            const data = await response.json();
            console.log(data);
            setNoticias(data.proyectos || []); // Acceder a los artículos dentro de la clave 'articulos'
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
    
    // Actualizamos la función handleVerMas para usar solo el id y luego buscar el proyecto
    const handleVerMas = (id: string) => {
        navigate(`/proyectos/${id}`); // Navegar usando el slug
        
    };

    const handleChangePage = (_event: React.ChangeEvent<unknown>, page: number) => {
        // setCurrentPage(page);
        setSearchParams({ page: page.toString() }); // Actualiza la URL
        window.scrollTo(0, 0);
    };

    return(
        <div className="Proyectos_Container">
            <div className="section">
                <div className="grid">
                {proyectos.map((project, index) => (
                    <Card
                    key={index}
                    titulo={project.titulo}
                    imagen={project.imagen}
                    autor={project.autor}
                    fecha={project.fecha_inicio}
                    cuerpo={project.cuerpo}
                    resumen={project.resumen}
                    onVerMas={() => handleVerMas(project.id)}  // Pasamos el id aquí
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

export default PaginaProyectos;

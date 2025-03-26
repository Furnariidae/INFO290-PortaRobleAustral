import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaginaArticulos.css';
import Card from '../../components/Card';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Articulo } from "../interfaces";

const PaginaArticulos: React.FC = () => {
    // const [currentPage, setCurrentPage] = useState(1);
    const [articles, setArticles] = useState<Articulo[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const articlesPerPage = 6;
    const apiUrl = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    // Extraer la página actual desde la URL
    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const handleVerMas = (id: string) => {
        navigate(`/articulos/${id}`);
    };

    const fetchArticles = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${apiUrl}/articulos/?page=${page}`);
            if (!response.ok) throw new Error('Error al cargar los artículos');
            const data = await response.json();
            console.log(data);
            setArticles(data.articulos || []); // Acceder a los artículos dentro de la clave 'articulos'
            setTotalPages(Math.ceil(data.total / articlesPerPage)); // Ajuste en total para que use la cantidad total de artículos
        } catch (error: any) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
        // setCurrentPage(page);
        setSearchParams({ page: page.toString() }); // Actualiza la URL
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        fetchArticles(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    return (
        <div className="Articulos_Container">
            {loading ? (
                <p>Cargando artículos...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <div className="section">
                        <div className="grid">
                            {articles.length > 0 ? (
                                articles.map((article) => {
                                    return (
                                        <Card
                                            key={article.id}
                                            titulo={article.titulo}
                                            imagen={article.galeria?.length > 0 ? article.galeria[0] : "default-image.jpg"}
                                            autor={article.autor}
                                            fecha={article.fechaIni}
                                            resumen={article.resumen}
                                            cuerpo={article.cuerpo}
                                            onVerMas={() => handleVerMas(article.id)}
                                            title="Ver más"
                                        />
                                    );
                                })
                            ) : (
                                <p>No se encontraron artículos.</p>
                            )}
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
                </>
            )}
        </div>
    );
};

export default PaginaArticulos;

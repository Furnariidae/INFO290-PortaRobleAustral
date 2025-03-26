import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronLeft, faPenToSquare, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import "./editar.css";
import { formatDate } from "../../../utils/dateUtils"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Articulo } from "../../interfaces"

const EditarArticulo: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [articles, setArticles] = useState<Articulo[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const articlesPerPage = 6;
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Sesión cerrada');
    }
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar a este integrante?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${apiUrl}/articulos/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar a el integrante");
            }

            // Elimina la colaboración del estado local
            setArticles((prevArticles) =>
                prevArticles.filter((articulo) => articulo.id !== id)
            );

            alert("Colaboración eliminada exitosamente");
        } catch (error) {
            setError("Hubo un error al eliminar la colaboración");
        }
    };

    const handleEdit = (articulo: Articulo) => {
        navigate("/admin/nuevo/articulo", { state: articulo });
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

    useEffect(() => {
        fetchArticles(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleChangePage = (_event: React.ChangeEvent<unknown>, page: number) => {
        setSearchParams({ page: page.toString() });
        window.scrollTo(0, 0);
    };

    return (
        <div className="editar">
            <div className="header">
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="back-button"
                    onClick={() => navigate(-1)}
                />
                <h1>Editar Artículos</h1>
            </div>
            {articles.map((article, index) => (
                <div className="edit-card">
                    <div className="first-column">
                        <img src={article.galeria[0]} alt={article.titulo} className="image" />
                    </div>
                    <div className="second-column">
                        <div className="titulo">{article.titulo}</div>
                        <div className="resumen">{article.resumen}</div>
                        <div className="fecha-autor">
                            <span>
                                <FontAwesomeIcon icon={faUser} />
                                <span className="autor"> {article.autor}</span>
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span className="fechas">
                                    {formatDate(article.fechaIni)}
                                    {article.fechaFin && (<> - {formatDate(article.fechaFin)}</>)}
                                </span>
                            </span>
                        </div>

                    </div>
                    <div className="third-column">
                        <button className="delete-button" onClick={() => handleDelete(article.id)}  ><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button className="edit-button" onClick={() => handleEdit(article)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                    </div>
                </div>
            ))}


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

export default EditarArticulo;

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronLeft, faPenToSquare, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import "./editar.css";
import { formatDate } from "../../../utils/dateUtils"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Noticia } from "../../interfaces"

const EditarNoticia: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const newsPerPage = 6;
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Sesión cerrada');
    }
    const navigate = useNavigate();
    
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta noticia?");
        if (!confirmDelete) return;
    
        try {
            const response = await fetch(`${apiUrl}/noticias/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
            });
    
            if (!response.ok) {
                throw new Error("Error al eliminar la noticia");
            }
    
            // Elimina la noticia del estado local
            setNoticias((prevNoticias) =>
                prevNoticias.filter((noticia) => noticia.id !== id)
            );
    
            alert("Noticia eliminada exitosamente");
        } catch (error) {
            setError("Hubo un error al eliminar la noticia");
        }
    };

    const handleEdit = (noticia: Noticia) => {
        navigate("/admin/nuevo/noticia", { state: noticia });
    };

    const fetchArticles = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${apiUrl}/noticias/?page=${page}`);
            if (!response.ok) throw new Error('Error al cargar los artículos');
            const data = await response.json();
            console.log(data);
            setNoticias(data.noticias || []); // Acceder a los artículos dentro de la clave 'articulos'
            setTotalPages(Math.ceil(data.total / newsPerPage)); // Ajuste en total para que use la cantidad total de artículos
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
                <h1>Editar Noticias</h1>
            </div>
            {noticias.map((noticia, index) => (
                <div className="edit-card">
                    <div className="first-column">
                        <img src={noticia.imagenes[0]} alt={noticia.titulo} className="image" />
                    </div>
                    <div className="second-column">
                        <div className="titulo">{noticia.titulo}</div>
                        <div className="resumen">{noticia.resumen}</div>
                        <div className="fecha-autor">
                            <span>
                                <FontAwesomeIcon icon={faUser} />
                                <span className="autor"> {noticia.autor}</span>
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span className="fechas">
                                    {formatDate(noticia.fecha)}
                                </span>
                            </span>
                        </div>

                    </div>
                    <div className="third-column">
                        <button className="delete-button" onClick={() => handleDelete(noticia.id)} ><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button className="edit-button" onClick={() => handleEdit(noticia)}><FontAwesomeIcon icon={faPenToSquare} /></button>
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

export default EditarNoticia;

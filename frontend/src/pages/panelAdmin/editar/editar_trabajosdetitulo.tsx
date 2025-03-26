import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronLeft, faPenToSquare, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import "./editar.css";
import { formatDate } from "../../../utils/dateUtils"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Tesis } from "../../interfaces";

const EditarTrabajosDeTitulo: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [trabajosDeTitulo, setTrabajosDeTitulo] = useState<Tesis[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const trabajosDeTituloPerPage = 6;
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Sesión cerrada');
    }

    const navigate = useNavigate();

    const handleEdit = (trabajo_de_titulo: Tesis) => {
        navigate("/admin/nuevo/trabajo-de-titulo", { state: trabajo_de_titulo });
    };

    const fetchTrabajosDeTitulo = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${apiUrl}/tesis/get_all/?page=${page}`);
            if (!response.ok) throw new Error('Error al cargar los artículos');
            const data = await response.json();
            console.log(data);
            setTrabajosDeTitulo(data.tesis || []);
            setTotalPages(Math.ceil(data.total / trabajosDeTituloPerPage));
        } catch (error: any) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta tesis?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${apiUrl}/tesis/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la tesis");
            }

            // Elimina la colaboración del estado local
            setTrabajosDeTitulo((prev) =>
                prev.filter((trabajo) => trabajo.id !== id)
            );

            alert("Tesis eliminada exitosamente");
        } catch (error) {
            setError("Hubo un error al eliminar la tesis");
        }
    };

    useEffect(() => {
        fetchTrabajosDeTitulo(currentPage);
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
                <h1>Editar Trabajos de Título</h1>
            </div>
            {trabajosDeTitulo.map((trabajo, index) => (
                <div className="edit-card">
                    <div className="first-column">
                        <img src={trabajo.galeria_imagenes[0]} alt={trabajo.titulo} className="image" />
                        <div className="tipo">{trabajo.tipo}</div>
                        <div className="nivel">{trabajo.nivel}</div>
                    </div>
                    <div className="second-column">
                        <div className="titulo">{trabajo.titulo}</div>
                        <div className="resumen">{trabajo.resumen}</div>
                        <div className="fecha-autor">
                            <span>
                                <FontAwesomeIcon icon={faUser} />
                                <span className="autor"> {trabajo.autor[0]}</span>
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span className="fechas">
                                    {formatDate(trabajo.fecha_inicio)}
                                    {trabajo.fecha_fin && (<> - {formatDate(trabajo.fecha_fin)}</>)}
                                </span>
                            </span>
                        </div>

                    </div>
                    <div className="third-column">
                        <button className="delete-button" onClick={() => handleDelete(trabajo.id)}><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button className="edit-button" onClick={() => handleEdit(trabajo)}><FontAwesomeIcon icon={faPenToSquare} /></button>
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

export default EditarTrabajosDeTitulo;

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronLeft, faPenToSquare, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import "./editar.css";
import { formatDate } from "../../../utils/dateUtils"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Practica } from "../../interfaces"

const EditarPractica: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [practicas, setPracticas] = useState<Practica[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Sesión cerrada');
    }
  
    const navigate = useNavigate();

    const handleEdit = (practica: Practica) => {
        navigate("/admin/nuevo/practica", { state: practica });
    };

    const fetchPracticas = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${apiUrl}/practicas/get_all/?page=${page}`);
            if (!response.ok) throw new Error('Error al cargar los artículos');
            const data = await response.json();
            console.log(data);

            const totalItems = data.total || 0;
            setPracticas(data.practicas || []);
            setTotalPages(Math.max(1, Math.ceil(totalItems / itemsPerPage)));
        } catch (error: any) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta practica?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${apiUrl}/practicas/${id}`, {
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
            setPracticas((prev) =>
                prev.filter((practica) => practica.id !== id)
            );

            alert("Colaboración eliminada exitosamente");
        } catch (error) {
            setError("Hubo un error al eliminar la colaboración");
        }
    };

    useEffect(() => {
        fetchPracticas(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <h1>Editar Prácticas</h1>
            </div>
            {practicas.map((practica, index) => (
                <div className="edit-card">
                    <div className="first-column">
                        <img src={practica.galeria[0]} alt={practica.nombre} className="image" />
                        <div className="tipo">{practica.nivel === "ini" ? "Inicial" : "Prof."}</div>
                    </div>
                    <div className="second-column">
                        <div className="titulo">{practica.nombre}</div>
                        <div className="resumen">{practica.resumen}</div>
                        <div className="fecha-autor">
                            <span>
                                <FontAwesomeIcon icon={faUser} />
                                <span className="autor"> {practica.participantes[0]}</span>
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span className="fechas">
                                    {formatDate(practica.fechaIni)}
                                    {practica.fechaFin && (<> - {formatDate(practica.fechaFin)}</>)}
                                </span>
                            </span>
                        </div>

                    </div>
                    <div className="third-column">
                        <button className="delete-button" onClick={() => handleDelete(practica.id)}><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button className="edit-button" onClick={() => handleEdit(practica)}><FontAwesomeIcon icon={faPenToSquare} /></button>
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

export default EditarPractica;

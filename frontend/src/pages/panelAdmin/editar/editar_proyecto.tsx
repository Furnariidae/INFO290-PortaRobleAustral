import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronLeft, faPenToSquare, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import "./editar.css";
import { formatDate } from "../../../utils/dateUtils"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Proyecto } from "../../interfaces"


const EditarProyecto: React.FC = () => {
    const [_loading, setLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const projectsPerPage = 6;
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Sesión cerrada');
    }
  
    const navigate = useNavigate();

    const handleEdit = (proyecto: Proyecto) => {
        navigate("/admin/nuevo/proyecto", { state: proyecto });
    };

    const fetchProjects = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${apiUrl}/proyectos/?page=${page}`);
            if (!response.ok) throw new Error('Error al cargar los artículos');
            const data = await response.json();
            console.log(data);
            setProyectos(data.proyectos || []);
            setTotalPages(Math.ceil(data.total / projectsPerPage));
        } catch (error: any) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este proyecto?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${apiUrl}/proyectos/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
      
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el proyecto");
            }

            // Elimina la colaboración del estado local
            setProyectos((prev) =>
                prev.filter((proyecto) => proyecto.id !== id)
            );

            alert("Proyecto eliminado exitosamente");
        } catch (error) {
            setError("Hubo un error al eliminar el proyecto");
        }
    };

    useEffect(() => {
        fetchProjects(currentPage);
    }, [currentPage]);

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
                <h1>Editar Proyectos</h1>
            </div>
            {proyectos.map((project, index) => (
                <div className="edit-card">
                    <div className="first-column">
                        <img src={project.imagen} alt={project.titulo} className="image" />
                    </div>
                    <div className="second-column">
                        <div className="titulo">{project.titulo}</div>
                        <div className="resumen">{project.resumen}</div>
                        <div className="fecha-autor">
                            <span>
                                <FontAwesomeIcon icon={faUser} />
                                <span className="autor"> {project.autor}</span>
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span className="fechas">
                                    {formatDate(project.fecha_inicio)}
                                    {project.fecha_fin && (<> - {formatDate(project.fecha_fin)}</>)}
                                </span>
                            </span>
                        </div>

                    </div>
                    <div className="third-column">
                        <button className="delete-button" onClick={() => handleDelete(project.id)} ><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button className="edit-button" onClick={() => handleEdit(project)}><FontAwesomeIcon icon={faPenToSquare} /></button>
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

export default EditarProyecto;

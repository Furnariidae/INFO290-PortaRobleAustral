import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronLeft, faEnvelope, faLink, faPenToSquare, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import "./editar.css";
import {formatDate} from "../../../utils/dateUtils"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Colaboracion } from "../../interfaces"

const EditarColaboracion: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [colaboraciones, setColaboraciones] = useState<Colaboracion[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    // const colaboracionesPerPage = 6;
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Sesión cerrada');
    }
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta colaboración?");
        if (!confirmDelete) return;
    
        try {
            const response = await fetch(`${apiUrl}/colaboraciones/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
            });
    
            if (!response.ok) {
                throw new Error("Error al eliminar la colaboración");
            }
    
            // Elimina la colaboración del estado local
            setColaboraciones((prevColaboraciones) =>
                prevColaboraciones.filter((colaboracion) => colaboracion.id !== id)
            );
    
            alert("Colaboración eliminada exitosamente");
        } catch (error) {
            setError("Hubo un error al eliminar la colaboración");
        }
    };

    const handleEdit = (colaboracion: Colaboracion) => {
        navigate("/admin/nuevo/colaboracion", { state: colaboracion });
    };

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        fetch(`${apiUrl}/colaboraciones`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }
                return response.json();
            })
            .then((data: Colaboracion[]) => {
                setColaboraciones(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

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
                <h1>Editar Colaboraciones</h1>
            </div>
            {colaboraciones.map((colaboracion, index) => (
                <div className="edit-card">
                    <div className="first-column">
                        <img src={colaboracion.imagen} alt={colaboracion.nombre} className="image" />
                    </div>
                    <div className="second-column">
                        <div className="titulo">{colaboracion.nombre}</div>
                        <div className="fecha-autor">
                            <span>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span className="fechas">
                                    {formatDate(colaboracion.fecha_ini)}
                                    {colaboracion.fecha_fin && ( <> - {formatDate(colaboracion.fecha_fin)}</> )}
                                </span>
                            </span>
                        </div>
                        {colaboracion.links[0]?.correo &&
                            <div className="fecha-autor">
                                <span>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    <span className="fechas">
                                        {colaboracion.links[0].correo}
                                    </span>
                                </span>
                            </div>
                        }
                        {colaboracion.links[0]?.web &&
                            <div className="fecha-autor">
                                <span>
                                    <FontAwesomeIcon icon={faLink} />
                                    <span className="fechas">
                                        {colaboracion.links[0].web}
                                    </span>
                                </span>
                            </div>
                        }


                    </div>
                    <div className="third-column">
                        <button className="delete-button" onClick={() => handleDelete(colaboracion.id)}><FontAwesomeIcon icon={faTrashCan}/></button>
                        <button className="edit-button" onClick={() => handleEdit(colaboracion)}><FontAwesomeIcon icon={faPenToSquare}/></button>
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

export default EditarColaboracion;

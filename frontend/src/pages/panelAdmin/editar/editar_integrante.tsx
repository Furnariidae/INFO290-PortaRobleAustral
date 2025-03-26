import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronLeft, faEnvelope, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./editar.css";
import { formatDate } from "../../../utils/dateUtils"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Integrante } from "../../interfaces"

const EditarIntegrante: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [personas, setPersonas] = useState<Integrante[]>([]);
    const personasPerPage = 6;
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
            const response = await fetch(`${apiUrl}/integrantes/delete/${id}`, {
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
            setPersonas((prevIntegrantes) =>
                prevIntegrantes.filter((integrante) => integrante.id !== id)
            );
    
            alert("Colaboración eliminada exitosamente");
        } catch (error) {
            setError("Hubo un error al eliminar la colaboración");
        }
    };

    const handleEdit = (integrante: Integrante) => {
        navigate("/admin/nuevo/integrante", { state: integrante });
    };

    useEffect(() => {
        fetch(`${apiUrl}/integrantes`)
            .then((response) => {
                if (!response.ok) throw new Error("Error en la solicitud");
                return response.json();
            })
            .then((data: Integrante[]) => {
                setPersonas(data);
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

    // Asegurarse de que las personas se ordenen correctamente en el frontend
    const personasConOrden = personas.filter((persona) => persona.orden !== undefined);
    const personasSinOrden = personas.filter((persona) => persona.orden === undefined);

    // Las personas con orden se colocan primero
    const sortedPersonas = [
        ...personasConOrden.sort((a, b) => (a.orden ?? Infinity) - (b.orden ?? Infinity)),
        ...personasSinOrden,
    ];

    // Lógica de paginación
    const totalPages = Math.ceil(sortedPersonas.length / personasPerPage);

    const displayedPersonas = sortedPersonas.slice(
        (currentPage - 1) * personasPerPage,
        currentPage * personasPerPage
    );

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
                <h1>Editar Integrantes</h1>
            </div>
            {displayedPersonas.map((persona, index) => (
                <div className="edit-card">
                    <div className="first-column">
                        <img src={persona.imagen} alt={persona.nombre} className="image" />
                    </div>
                    <div className="second-column">
                        <div className="titulo">{persona.nombre}</div>
                        <div className="resumen">{persona.profesion}</div>
                        <div className="fecha-autor">
                            <span>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span className="fechas">
                                    {formatDate(persona.fecha)}
                                </span>
                            </span>
                        </div>
                        <div className="fecha-autor">
                            <span>
                                <FontAwesomeIcon icon={faEnvelope} />
                                <span className="correo">
                                    {persona.correo}
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="third-column">
                        <button className="delete-button" onClick={() => handleDelete(persona.id)}><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button className="edit-button" onClick={() => handleEdit(persona)}><FontAwesomeIcon icon={faPenToSquare} /></button>
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

export default EditarIntegrante;

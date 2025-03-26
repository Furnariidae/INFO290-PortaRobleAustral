 import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./editar.css";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface Institucion {
    id: string;
    nombre: string;
    imagen: string;
}

const EditarInstitucion: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    // const [totalPages, setTotalPages] = useState(1);
    // const institucionesPerPage = 6;
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Sesión cerrada');
    }
  
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${apiUrl}/instituciones`)
            .then((response) => {
                if (!response.ok) throw new Error("Error en la solicitud");
                return response.json();
            })
            .then((data) => {
                // const institucionesDict: InstitucionesDict = data.reduce((acc: InstitucionesDict, item: Institucion) => {
                //   acc[item.nombre] = item.imagen;
                //   return acc;
                // }, {});

                setInstituciones(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [apiUrl]);

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar a esta institución?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${apiUrl}/instituciones/${id}`, {
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
            setInstituciones((prev) =>
                prev.filter((institucion) => institucion.id !== id)
            );

            alert("Institución eliminada exitosamente");
        } catch (error) {
            setError("Hubo un error al eliminar esta institución");
        }
    };

    const handleEdit = (institucion: Institucion) => {
        navigate("/admin/nuevo/institucion", { state: institucion });
    };

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
                <h1>Editar Institución</h1>
            </div>
            <div className="instituciones-grid">
                {instituciones.map((institucion, index) => (
                    <div className="edit-card">
                        <div className="first-column">
                            <img src={institucion.imagen} alt={institucion.nombre} className="image-institucion" />
                        </div>
                        <div className="second-column-institucion">
                            <div className="nombre-institucion">{institucion.nombre}</div>
                            <div className="buttons-editar-institucion">
                                <button className="delete-button" onClick={() => handleDelete(institucion.id)}  ><FontAwesomeIcon icon={faTrashCan} /></button>
                                <button className="edit-button" onClick={() => handleEdit(institucion)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Stack className='paginacion_mui' spacing={2}>
                <Pagination
                    // count={totalPages} 
                    page={currentPage}
                    onChange={handleChangePage}
                    size="medium"
                    shape="rounded"
                />
            </Stack>
        </div>
    );
};

export default EditarInstitucion;

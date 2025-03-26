import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./PaginaResultadosBusqueda.css";
import { NavLink } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

type Elemento = {
    titulo: string;
    etiquetas: string[];
    id_elem: string;
    url_path: string;
};

const PaginaResultadosBusqueda: React.FC = () => {
    const location = useLocation();
    const elementos: Elemento[] = location.state?.elementos || [];
    const [currentPage, setCurrentPage] = useState(1);
    const elementsPerPage = 6;
    const totalPages = Math.ceil(elementos.length / elementsPerPage);

    const indexOfLastElement = currentPage * elementsPerPage;
    const indexOfFirstElement = indexOfLastElement - elementsPerPage;
    const currentElements = elementos.slice(indexOfFirstElement, indexOfLastElement);

    const handleChangePage = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    return (
        <div className="ResultadosBusquedaContainer">
            <h3 className="BusquedaTitulo">Resultados de la Búsqueda</h3>
            <div className="ListaResultadosBusqueda">
                {currentElements.length > 0 ? (
                    currentElements.map((elemento: { id_elem: string; titulo: string, etiquetas: string [], url_path: string }) => (
                        <NavLink to={`/${elemento.url_path}${elemento.id_elem}`}  className="ResultadoTarjetaLink">
                            <div className="ResultadoTarjeta">
                                <h4>{elemento.titulo}</h4>
                                <ul className="TagsLista">
                                {elemento.etiquetas.map((tag, i) => {
                                    const estadoClase = tag === "Terminado" ? "estado-terminado" : tag === "En proceso" ? "estado-en-proceso" : "";
                                    return (
                                        <li key={i} className={estadoClase}>{tag}</li>
                                    );
                                })}
                                </ul>
                            </div>
                        </NavLink>
                    ))
                ) : (
                    <div>No se encontraron resultados.</div>
                )}
            </div>
            <Stack className='paginacion_mui' spacing={2} style={{ marginTop: "20px" }}>
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

export default PaginaResultadosBusqueda;
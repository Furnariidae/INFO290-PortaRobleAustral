import React, { useEffect, useState } from "react";
import TarjetaColaborador from './TarjetaColaborador';
import "./PaginaColaboraciones.css";
import {formatDate} from "../../utils/dateUtils"
import { Colaboracion } from "../interfaces"

const PaginaColaboraciones = () => {
    const [colaboraciones, setColaboraciones] = useState<Colaboracion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="paginaColaboraciones_Container">
            <div className="gridColaboraciones">
                {colaboraciones.map((colaborador) => (
                    <TarjetaColaborador
                        key={colaborador.id}
                        nombre={colaborador.nombre}
                        fecha_ini={formatDate(colaborador.fecha_ini)}
                        fecha_fin={formatDate(colaborador.fecha_fin)}
                        index={0}  // Adjusted as needed or remove if unnecessary
                        image={colaborador.imagen}
                        links={colaborador.links}  // Directly passing array of Link objects
                    />
                ))}
            </div>
        </div>
    );
};

export default PaginaColaboraciones;
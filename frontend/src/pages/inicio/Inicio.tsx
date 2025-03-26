import React , { useEffect, useState } from "react";
import "./Inicio.css"; 
import { InicioData } from "../interfaces"

const Inicio: React.FC = () => {
    
    const [inicioData, setInicioData] = useState<InicioData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        fetch(`${apiUrl}/inicio`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }
                return response.json();
            })
            .then((data) => {
                setInicioData(data);
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
        <div className="inicial-content">
            <div className="title-container">
                <h2>Inicio</h2>
            </div>

            {inicioData && (
                <div className="information-container">
                    <div className="description-container">
                        <p>{inicioData.descripcion}</p>
                    </div>
                    <div className="image-container">
                        <img src={inicioData.imagen} alt="Imagen" className="image" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inicio;

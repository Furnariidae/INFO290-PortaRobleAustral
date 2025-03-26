import { faChevronLeft, faEnvelope, faLink, faPlay, faSchool, faStop, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Colaboracion } from "../../interfaces";
import "./nuevo.css";

const formatFechaToInputDate = (fecha: string) => {
    return fecha.split("T")[0];
};

const NuevoColaboracion: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const colaboracionEditada = location.state as Colaboracion | null;
    const correoInicial = colaboracionEditada?.links.find(link => link.correo)?.correo || "";
    const sitioWebInicial = colaboracionEditada?.links.find(link => link.web)?.web || "";
    const [nombre, setNombre] = useState<string>(colaboracionEditada?.nombre || "");
    const [fecha_inicio, setFecha_inicio] = useState<string>(colaboracionEditada?.fecha_ini ? formatFechaToInputDate(colaboracionEditada.fecha_ini) : "");
    const [fecha_fin, setFecha_fin] = useState<string>(colaboracionEditada?.fecha_fin ? formatFechaToInputDate(colaboracionEditada.fecha_fin) : "");
    const [errorFechas, setErrorFechas] = useState<string | null>(null);
    const [correo, setCorreo] = useState<string>(correoInicial);
    const [sitio_web, setSitio_web] = useState<string>(sitioWebInicial);
    const [fileName, setFileName] = useState<string>(colaboracionEditada?.imagen ? colaboracionEditada.imagen.split("/").pop() || "" : "");
    const [imagePreview, setImagePreview] = useState<string>(colaboracionEditada?.imagen || "");
    const [image_path, setImage_path] = useState<string>(colaboracionEditada?.imagen || "");
    const [errorFoto, setErrorFoto] = useState<boolean>(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Sesión cerrada');
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            // Verificar si el archivo es una imagen
            if (file.type.startsWith("image/")) {
                setFileName(file.name);
                setImage_path(`/imagenes_colaboraciones/${file.name}`);

                // Crear una URL de la imagen para mostrar la vista previa
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string); // Guardar la URL de la imagen
                };
                reader.readAsDataURL(file); // Leer la imagen como URL
                setErrorFoto(false);
            } else {
                // Si el archivo no es una imagen, restablecer el nombre y la vista previa
                setFileName("");
                setImagePreview("");
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        let hasError = false;

        if (fecha_inicio && fecha_fin && new Date(fecha_fin) < new Date(fecha_inicio)) {
            setErrorFechas("La fecha de fin debe ser mayor o igual a la fecha de inicio.");
            if (!hasError) window.scrollTo(0, 480);
            hasError = true;
        } else {
            setErrorFechas(null);
        }

        if (!image_path) {
            setErrorFoto(true);
            hasError = true;
        }

        if (!hasError) {
            const colaboracionPayload = {
                nombre: nombre,
                fecha_ini: fecha_inicio,
                fecha_fin: fecha_fin,
                links: [{ web: sitio_web }, { correo: correo }],
                imagen: image_path,
            };
            console.log(colaboracionPayload);

            try {
                const response = colaboracionEditada ? await fetch(`${apiUrl}/colaboraciones/put/${colaboracionEditada.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(colaboracionPayload)
                })
                    : await fetch(`${apiUrl}/colaboraciones/post`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(colaboracionPayload)
                    });
                if (response.ok) {
                    const data = await response.json();
                    console.log(colaboracionEditada ? "Colaboración editada exitosamente" : "Colaboración creada exitosamente:", data);
                    navigate(-1);
                } else {
                    console.error(colaboracionEditada ? "Error al editar la colaboración" : "Error al crear la colaboración:", response.statusText);
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            }
        }
    };

    return (
        <div className="nuevo">
            <div className="header">
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="back-button"
                    onClick={() => navigate(-1)}
                />
                <h1>{colaboracionEditada ? "Editar Colaboración" : "Crear Nueva Colaboración"}</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <FontAwesomeIcon icon={faSchool} className="icon" />
                    <label htmlFor="nombre" className="label">Nombre:</label>
                    <TextField
                        required
                        id="nombre"
                        name="nombre"
                        label="Ingrese el nombre ..."
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div>
                    <FontAwesomeIcon icon={faPlay} className="icon" />
                    <label htmlFor="fecha_inicio" className="label">Fecha Inicio:</label>
                    <TextField
                        required
                        type="date"
                        id="fecha_inicio"
                        name="fecha_inicio"
                        value={fecha_inicio}
                        onChange={(e) => setFecha_inicio(e.target.value)}
                    />
                </div>
                <div>
                    <FontAwesomeIcon icon={faStop} className="icon" />
                    <label htmlFor="fecha_fin" className="label">Fecha Fin:</label>
                    <TextField
                        type="date"
                        id="fecha_fin"
                        name="fecha_fin"
                        value={fecha_fin}
                        onChange={(e) => setFecha_fin(e.target.value)}
                        error={!!errorFechas}
                        helperText={errorFechas || ""}
                    />
                </div>
                <div>
                    <FontAwesomeIcon icon={faEnvelope} className="icon" />
                    <label htmlFor="correo" className="label">Email:</label>
                    <TextField
                        type="email"
                        id="correo"
                        name="correo"
                        label="Ingrese el correo ..."
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                </div>
                <div>
                    <FontAwesomeIcon icon={faLink} className="icon" />
                    <label htmlFor="sitio_web" className="label">Sitio Web:</label>
                    <TextField
                        type="url"
                        id="sitio_web"
                        name="sitio_web"
                        label="Enlace al Sitio Web ..."
                        value={sitio_web}
                        onChange={(e) => setSitio_web(e.target.value)}
                    />
                </div>
                <div className="file-input-container">
                    <label htmlFor="foto" className="custom-file-label">
                        <FontAwesomeIcon icon={faUpload} className="icon-white" /> Subir Foto
                    </label>
                    <input
                        type="file"
                        id="foto"
                        name="foto"
                        accept="image/*"
                        onChange={handleFileChange}
                    // required
                    />
                    <span className="file-name">{fileName}</span>

                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Vista previa" />
                        </div>
                    )}
                    {errorFoto && <div className="error-message">¡Debe subir una foto!</div>}
                </div>
                <button type="submit" className="save-button">Guardar</button>
            </form>
        </div>
    );
};

export default NuevoColaboracion;

import { faCalendarDays, faChevronLeft, faEnvelope, faUpload, faUser, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Integrante } from "../../interfaces";
import "./nuevo.css";

const formatFechaToInputDate = (fecha: string) => {
  return fecha.split("T")[0];
};

const NuevoIntegrante: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const personaEditada = location.state as Integrante | null;

  const [nombre, setNombre] = useState<string>(personaEditada?.nombre || "");
  const [ocupacion, setOcupacion] = useState<string>(personaEditada?.profesion || "");
  const [correo, setCorreo] = useState<string>(personaEditada?.correo || "");
  const [fecha, setFecha] = useState<string>(personaEditada?.fecha ? formatFechaToInputDate(personaEditada.fecha) : "");
  const [linkedin, setLinkedin] = useState<string>(personaEditada?.linkedin || "");
  const [fileName, setFileName] = useState<string>(personaEditada?.imagen ? personaEditada.imagen.split("/").pop() || "" : "");
  const [imagePreview, setImagePreview] = useState<string>(personaEditada?.imagen || "");
  const [image_path, setImage_path] = useState<string>(personaEditada?.imagen || "");
  const [errorFoto, setErrorFoto] = useState<boolean>(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Sesión cerrada');
  }

  // const handleBack = () => useNavigate()(-1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Verificar si el archivo es una imagen
      if (file.type.startsWith("image/")) {
        setFileName(file.name);

        // Guardar el la ruta de la imagen
        const path = `/imagenes_personas/${file.name}`;
        setImage_path(path);

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
    event.preventDefault(); // Evitar que la página se recargue

    let hasError = false;

    if (!image_path) {
      setErrorFoto(true);
      hasError = true;
    }

    // Si no hay errores, continuar con el envío
    if (!hasError) {
      const personaPayload = {
        nombre: nombre,
        fecha: fecha,
        correo: correo,
        imagen: image_path,
        linkedin: linkedin,
        profesion: ocupacion
      }

      console.log(personaPayload);

      try {
        const response = personaEditada ? await fetch(`${apiUrl}/integrantes/put/${personaEditada.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify(personaPayload)
        }) :
          await fetch(`${apiUrl}/integrantes/post`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(personaPayload)
          });

        if (response.ok) {
          const data = await response.json();
          console.log(personaEditada ? "Integrante actualizado exitosamente:" : "Integrante creado exitosamente:", data);
          navigate(-1);
        } else {
          console.error(personaEditada ? "Error al actualizar al integrante:" : "Error al crear a el Integrante:", response.statusText);
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
        <h1>{personaEditada ? "Editar Integrante" : "Crear Nuevo Integrante"}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <FontAwesomeIcon icon={faUser} className="icon" />
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
          <FontAwesomeIcon icon={faUserTie} className="icon" />
          <label htmlFor="ocupacion" className="label">Ocupación:</label>
          <TextField
            required
            id="ocupacion"
            name="ocupacion"
            label="Ingrese la ocupación ..."
            value={ocupacion}
            onChange={(e) => setOcupacion(e.target.value)}
          />
        </div>

        <div>
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <label htmlFor="correo" className="label">Email:</label>
          <TextField
            required
            type="email"
            id="correo"
            name="correo"
            label="Ingrese el correo ..."
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div>
          <FontAwesomeIcon icon={faCalendarDays} className="icon" />
          <label htmlFor="fecha" className="label">Fecha:</label>
          <TextField
            required
            type="date"
            id="fecha"
            name="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div>
          <img src="/linkedin_logo.png" alt="LinkedIn Logo" className="icon" />
          <label htmlFor="linkedin" className="label">LinkedIn:</label>
          <TextField
            required
            type="url"
            id="linkedin"
            name="linkedin"
            label="URL al perfil de linkedin ..."
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
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

export default NuevoIntegrante;

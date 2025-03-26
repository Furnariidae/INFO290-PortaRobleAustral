import { faChevronLeft, faUpload, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./nuevo.css";

interface Institucion {
  id: string;
  nombre: string;
  imagen: string;
}

const NuevoIntegrante: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const institucionEditada = location.state as Institucion | null;

  const [nombre, setNombre] = useState<string>(institucionEditada?.nombre || "");
  const [fileName, setFileName] = useState<string>(institucionEditada?.imagen ? institucionEditada.imagen.split("/").pop() || "" : "");
  const [imagePreview, setImagePreview] = useState<string>(institucionEditada?.imagen || "");
  const [image_path, setImage_path] = useState<string>(institucionEditada?.imagen || "");
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

        // Guardar el la ruta de la imagen
        const path = `/imagenes_instituciones/${file.name}`;
        setImage_path(path);

        // Crear una URL de la imagen para mostrar la vista previa
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string); // Guardar la URL de la imagen
        };
        reader.readAsDataURL(file); // Leer la imagen como URL
      } else {
        // Si el archivo no es una imagen, restablecer el nombre y la vista previa
        setFileName("El archivo no es una imagen");
        setImagePreview("");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Evitar que la página se recargue

    let hasError = false;

    // Si no hay errores, continuar con el envío
    if (!hasError) {
      const institucionPayload = {
        nombre: nombre,
        imagen: image_path,
      };
      console.log(institucionPayload);

      try {
        const response = institucionEditada ? await fetch(`${apiUrl}/instituciones/${institucionEditada.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify(institucionPayload)
        })
          : await fetch(`${apiUrl}/instituciones`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(institucionPayload)
          });
        if (response.ok) {
          const data = await response.json();
          console.log(institucionEditada ? "Institucion editada exitosamente" : "Institucion creada exitosamente:", data);
          navigate(-1);
        } else {
          console.error(institucionEditada ? "Error al editar la institucion" : "Error al crear la institucion:", response.statusText);
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
        <h1>Crear Nueva Institución</h1>
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
            required={!institucionEditada}
          />
          <span className="file-name">{fileName}</span>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Vista previa" />
            </div>
          )}
        </div>
        <button type="submit" className="save-button">Guardar</button>
      </form>
    </div>
  );
};

export default NuevoIntegrante;

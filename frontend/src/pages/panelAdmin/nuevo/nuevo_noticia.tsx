import { faCalendarDays, faChevronLeft, faClipboard, faFileAlt, faHeading, faUpload, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Noticia } from "../../interfaces";
import "./nuevo.css";

const formatFechaToInputDate = (fecha: string) => {
  return fecha.split("T")[0];
};

const NuevoNoticia: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const noticiaEditada = location.state as Noticia | null;
  const apiUrl = process.env.REACT_APP_API_URL;
  const [titulo, setTitulo] = useState<string>(noticiaEditada?.titulo || "");
  const [resumen, setResumen] = useState<string>(noticiaEditada?.resumen || "");
  const [cuerpo, setCuerpo] = useState<string>(noticiaEditada?.cuerpo || "");
  const [autor, setAutor] = useState<string>(noticiaEditada?.autor || "");
  const [fecha, setFecha] = useState<string>(noticiaEditada?.fecha ? formatFechaToInputDate(noticiaEditada.fecha) : "");
  const [fileNames, setFileNames] = useState<string[]>(noticiaEditada?.imagenes?.map((imagen) => imagen.split("/").pop() || "") || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>(noticiaEditada?.imagenes || []);
  const [imagePaths, setImagePaths] = useState<string[]>(noticiaEditada?.imagenes || []);
  const [errorFotos, setErrorFotos] = useState<boolean>(false);
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Sesión cerrada');
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files); // Convierte FileList en un array
      const validFiles = files.filter((file) => file.type.startsWith("image/")); // Solo imágenes

      if (validFiles.length > 0) {
        const newFileNames = validFiles.map((file) => file.name);
        setFileNames([...fileNames, ...newFileNames]); // Actualiza los nombres de archivos

        // Generar paths de las imágenes
        const paths = validFiles.map((file) => `/imagenes_noticias/${file.name}`);
        setImagePaths([...imagePaths, ...paths]);

        // Crear vistas previas
        const readers = validFiles.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        });

        Promise.all(readers).then((previews) => setImagePreviews([...imagePreviews, ...previews])); // Actualiza vistas previas
        setErrorFotos(false); // Restablecer error de fotos si se sube una imagen válida
      } else {
        setFileNames([]);
        setImagePreviews([]);
        setImagePaths([]);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Evitar que la página se recargue

    let hasError = false;

    if (imagePaths.length === 0) {
      setErrorFotos(true);
      hasError = true;
    }

    // Si no hay errores, continuar con el envío
    if (!hasError) {
      const noticiaPayload = {
        titulo: titulo,
        imagenes: imagePaths,
        resumen: resumen,
        cuerpo: cuerpo,
        autor: autor,
        fecha: fecha
      };

      console.log(noticiaPayload);

      try {
        const response = noticiaEditada ?
          await fetch(`${apiUrl}/noticias/put/${noticiaEditada.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(noticiaPayload)
          }) :
          await fetch(`${apiUrl}/noticias/post`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(noticiaPayload)
          });

        if (response.ok) {
          const data = await response.json();
          console.log(noticiaEditada ? "Noticia actualizada exitosamente:" : "Noticia creada exitosamente:", data);
          navigate(-1);
        } else {
          console.error(noticiaEditada ? "Error al actualizar la noticia:" : "Error al crear la noticia:", response.statusText);
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
        <h1>{noticiaEditada ? "Editar Noticia" : "Crear Nueva Noticia"}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <FontAwesomeIcon icon={faHeading} className="icon" />
          <label htmlFor="titulo" className="label">Título:</label>
          <TextField
            required
            id="titulo"
            name="titulo"
            label="Ingrese el título ..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div>
          <FontAwesomeIcon icon={faClipboard} className="icon" />
          <label htmlFor="resumen" className="label">Resumen:</label>
          <textarea
            id="resumen"
            name="resumen"
            placeholder="Ingrese el resumen ... *"
            required
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            rows={3}
            className="cuerpo"
          />
        </div>
        <div>
          <FontAwesomeIcon icon={faFileAlt} className="icon" />
          <label htmlFor="cuerpo" className="label">Cuerpo:</label>
          <textarea
            id="cuerpo"
            name="cuerpo"
            placeholder="Ingrese el cuerpo ... *"
            required
            value={cuerpo}
            onChange={(e) => setCuerpo(e.target.value)}
            rows={4}
            className="cuerpo"
          />
        </div>

        <div>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <label htmlFor="autor" className="label">Autor:</label>
          <TextField
            required
            id="autor"
            name="autor"
            label="Ingrese el autor ..."
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
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
        <div className="file-input-container">
          <label htmlFor="foto" className="custom-file-label">
            <FontAwesomeIcon icon={faUpload} className="icon-white" /> Subir Foto(s)
          </label>
          <input
            type="file"
            id="foto"
            name="foto"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <span className="file-name">{fileNames.join(", ")}</span>

          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview} alt={`Vista previa ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
          {errorFotos && <div className="error-message">¡Debe subir al menos una foto!</div>}
        </div>

        <button type="submit" className="save-button">Guardar</button>
      </form>
    </div>
  );
};

export default NuevoNoticia;

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faChevronLeft, faCircleCheck, faClipboard, faFileAlt, faFilePdf, faHeading, faLink, faPen, faPlay, faSchool, faStop, faTags, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Integrante, Proyecto } from "../../interfaces";
import "./nuevo.css";

const formatFechaToInputDate = (fecha: string) => {
  return fecha.split("T")[0];
};

interface Institucion {
  id: string;
  nombre: string;
  imagen: string;
}

type InstitucionesDict = {
  [key: string]: string;
};

const NuevoProyecto: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const proyectoEditado = location.state as Proyecto | null;
  const apiUrl = process.env.REACT_APP_API_URL;
  const [fileNames, setFileNames] = useState<string[]>(proyectoEditado?.galeria_imagenes?.map((imagen) => imagen.split("/").pop() || "") || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>(proyectoEditado?.galeria_imagenes || []);
  const [imagePaths, setImagePaths] = useState<string[]>(proyectoEditado?.galeria_imagenes || []);
  const [errorFotos, setErrorFotos] = useState<boolean>(false);
  const [titulo, setTitulo] = useState<string>(proyectoEditado?.titulo || "");
  const [autor, setAutor] = useState<string>(proyectoEditado?.autor || "");
  const [participantes, setParticipantes] = useState<string[]>(proyectoEditado?.participantes || []);
  const [errorParticipantes, setErrorParticipantes] = useState(false);
  const [etiquetas, setEtiquetas] = useState<string[]>(proyectoEditado?.etiquetas || []);
  const [errorEtiquetas, setErrorEtiquetas] = useState(false);
  const [fecha_inicio, setFecha_inicio] = useState<string>(proyectoEditado?.fecha_inicio ? formatFechaToInputDate(proyectoEditado.fecha_inicio) : "");
  const [fecha_fin, setFecha_fin] = useState<string>(proyectoEditado?.fecha_fin ? formatFechaToInputDate(proyectoEditado.fecha_fin) : "");
  const [errorFechas, setErrorFechas] = useState<string | null>(null);
  const [resumen, setResumen] = useState<string>(proyectoEditado?.resumen || "");
  const [cuerpo, setCuerpo] = useState<string>(proyectoEditado?.cuerpo || "");
  const [estado, setEstado] = useState<string>(proyectoEditado?.estado || "");
  const [github, setGithub] = useState<string>(proyectoEditado?.url_github || "");
  const [sitio_web, setSitio_web] = useState<string>(proyectoEditado?.url_proyecto || "");
  const [tienePDF, setTienePDF] = useState<boolean>(proyectoEditado?.pdf || false);
  const [instituciones, setInstituciones] = useState<string[]>(proyectoEditado?.instituciones?.map((institucion) => institucion.nombre) || []);
  const [errorInstituciones, setErrorInstituciones] = useState(false);
  const [opcionesEtiquetas, setOpcionesEtiquetas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [opcionesInstituciones, setOpcionesInstituciones] = useState<InstitucionesDict>({});
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Sesión cerrada');
  }

  useEffect(() => {
    fetch(`${apiUrl}/integrantes`)
      .then((response) => {
        if (!response.ok) throw new Error("Error en la solicitud");
        return response.json();
      })
      .then((data: Integrante[]) => {
        setIntegrantes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [apiUrl]);

  useEffect(() => {
    fetch(`${apiUrl}/sys_data/etiquetas_only_etiquetas`)
      .then((response) => {
        if (!response.ok) throw new Error("Error en la solicitud");
        return response.json();
      })
      .then((data) => {
        setOpcionesEtiquetas(data.etiquetas);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [apiUrl]);

  useEffect(() => {
    fetch(`${apiUrl}/instituciones`)
      .then((response) => {
        if (!response.ok) throw new Error("Error en la solicitud");
        return response.json();
      })
      .then((data: Institucion[]) => {
        const institucionesDict: InstitucionesDict = data.reduce((acc: InstitucionesDict, item: Institucion) => {
          acc[item.nombre] = item.imagen;
          return acc;
        }, {});

        setOpcionesInstituciones(institucionesDict);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const opcionesEstado = [
    "Finalizada",
    "En progreso",
    "No terminada",
  ];

  const opcionesAutores = integrantes.map((integrante) => integrante.nombre).sort((a, b) => a.localeCompare(b));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files); // Convierte FileList en un array
      const validFiles = files.filter((file) => file.type.startsWith("image/")); // Solo imágenes

      if (validFiles.length > 0) {
        const newFileNames = validFiles.map((file) => file.name);
        setFileNames([...fileNames, ...newFileNames]);

        // Generar paths de las imágenes
        const paths = validFiles.map((file) => `/imagenes_proyectos/${file.name}`);
        setImagePaths([...imagePaths, ...paths]);

        // Crear vistas previas
        const readers = validFiles.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        });

        Promise.all(readers).then((previews) => setImagePreviews(previews)); // Actualiza vistas previas
        setErrorFotos(false); // Restablecer error de fotos si se sube una imagen válida
      } else {
        // Si no hay imágenes válidas
        setFileNames([""]);
        setImagePreviews([]);
        setImagePaths([]);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Evitar que la página se recargue

    let hasError = false;

    if (fecha_inicio && fecha_fin && new Date(fecha_fin) < new Date(fecha_inicio)) {
      setErrorFechas("La fecha de fin debe ser mayor o igual a la fecha de inicio.");
      if (!hasError) window.scrollTo(0, 480);
      hasError = true;
    } else {
      setErrorFechas(null);
    }

    if (participantes.length === 0) {
      setErrorParticipantes(true);
      if (!hasError) window.scrollTo(0, 310);
      hasError = true;
    } else {
      setErrorParticipantes(false);
    }

    if (instituciones.length === 0) {
      setErrorInstituciones(true);
      // if (!hasError) window.scrollTo(0, 310);
      hasError = true;
    } else {
      setErrorInstituciones(false);
    }

    if (imagePaths.length === 0) {
      setErrorFotos(true);
      // if (!hasError) window.scrollTo(0, 550);
      hasError = true;
    }

    const proyecto: Proyecto = {
      id: "",
      autor: autor, //ok
      titulo, //ok
      etiquetas: etiquetas,
      participantes: participantes, //ok
      fecha_inicio, //ok
      fecha_fin, //ok
      resumen, //ok
      cuerpo, //ok
      estado, //ok
      url_github: github, //ok
      url_proyecto: sitio_web, //ok
      instituciones: instituciones.map((inst) => ({ nombre: inst, imagen: "/imagenes_instituciones/uach_logo.png" })), //ok
      galeria_imagenes: imagePaths,
      pdf: true,
      imagen: imagePaths[0],
    };

    if (!hasError) {
      console.log(JSON.stringify(proyecto));
      try {
        const response = proyectoEditado ?
          await fetch(`${apiUrl}/proyectos/${proyectoEditado.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(proyecto)
          }) :
          await fetch(`${apiUrl}/proyectos`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(proyecto)
          });

        if (response.ok) {
          const data = await response.json();
          console.log(proyectoEditado ? "Proyecto editado exitosamente" : "Proyecto creado exitosamente", data);
          navigate(-1);
        } else {
          console.error(proyectoEditado ? "Error al editar el proyecto" : "Error al crear el proyecto", response.statusText);
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
        <h1>{proyectoEditado ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</h1>
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
          <FontAwesomeIcon icon={faHeading} className="icon" />
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
          <FontAwesomeIcon icon={faPen} className="icon" />
          <label htmlFor="participantes" className="label">Participante(s):</label>
          <Autocomplete
            multiple
            freeSolo
            id="participantes"
            options={opcionesAutores}
            value={participantes}
            disableCloseOnSelect
            onChange={(_event, value) => {
              setParticipantes(value);
              if (value.length > 0) setErrorParticipantes(false);
            }}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option}
                </li>
              );
            }}
            className="dropdown"
            renderInput={(params) => (
              <TextField {...params} label="Seleccione autores ... *" placeholder="Autores ..." error={errorParticipantes} helperText={errorParticipantes ? "Debe seleccionar al menos un autor" : ""} />
            )}
          />
        </div>

        <div>
          <FontAwesomeIcon icon={faTags} className="icon" />
          <label htmlFor="etiquetas" className="label">Etiquetas:</label>
          <Autocomplete
            multiple
            id="etiquetas"
            options={opcionesEtiquetas}
            disableCloseOnSelect
            value={etiquetas}
            onChange={(_event, value) => {
              setEtiquetas(value);
              if (value.length > 0) setErrorEtiquetas(false);
            }}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option}
                </li>
              );
            }}
            className="dropdown"
            renderInput={(params) => (
              <TextField {...params} label="Seleccione etiquetas ... *" placeholder="Etiquetas ..." error={errorEtiquetas} helperText={errorEtiquetas ? "Debe seleccionar al menos un autor" : ""}
              />
            )}
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
          <FontAwesomeIcon icon={faCircleCheck} className="icon" />
          <label htmlFor="estado" className="label">Estado:</label>
          <Autocomplete
            disablePortal
            id="estado"
            options={opcionesEstado}
            className="dropdown"
            value={estado}
            onChange={(_event, value) => setEstado(value || "")}
            renderInput={(params) => <TextField {...params} required label="Seleccione un estado" />}
          />
        </div>
        <div>
          <FontAwesomeIcon icon={faGithub} className="icon" />
          <label htmlFor="github" className="label">Github:</label>
          <TextField
            type="url"
            id="github"
            name="github"
            label="Enlace al repositorio Github ..."
            value={github}
            onChange={(e) => setGithub(e.target.value)}
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
        <div>
          <FontAwesomeIcon icon={faSchool} className="icon" />
          <label htmlFor="instituciones" className="label">Institución(es):</label>
          <Autocomplete
            multiple
            id="instituciones"
            options={Object.keys(opcionesInstituciones)}
            value={instituciones}
            disableCloseOnSelect
            onChange={(_event, value) => {
              setInstituciones(value);
              if (value.length > 0) setErrorInstituciones(false);
            }}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option}
                </li>
              );
            }}
            className="dropdown"
            renderInput={(params) => (
              <TextField {...params} label="Seleccione instituciones ... *" placeholder="Instituciones ..." error={errorInstituciones} helperText={errorInstituciones ? "Debe seleccionar al menos una Institución" : ""} />
            )}
          />
        </div>
        <div>
          <FontAwesomeIcon icon={faFilePdf} className="icon" />
          <label htmlFor="pdf" className="label">¿Tiene PDF?</label>
          <div className="span-pdf">
            No
            <Switch checked={tienePDF} onChange={(e) => setTienePDF(e.target.checked)} />
            Si
          </div>
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

export default NuevoProyecto;

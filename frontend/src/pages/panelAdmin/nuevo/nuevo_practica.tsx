import { faChevronLeft, faCircleCheck, faClipboard, faHeading, faPen, faPlay, faSchool, faStop, faTags, faUpload, faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Integrante, Practica } from "../../interfaces";
import "./nuevo.css";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const formatFechaToInputDate = (fecha: string) => {
  return fecha.split("T")[0];
};

interface Institucion {
  id: string;
  nombre: string;
  imagen: string;
}

type InstitucionesDict = {
  [key: string]: string; // El key es el nombre de la institución y el valor es la imagen
};

const NuevoPractica: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const practicaEditada = location.state as Practica | null;
  const apiUrl = process.env.REACT_APP_API_URL;
  const [fileNames, setFileNames] = useState<string[]>(practicaEditada?.galeria?.map((imagen) => imagen.split("/").pop() || "") || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>(practicaEditada?.galeria || []);
  const [imagePaths, setImagePaths] = useState<string[]>(practicaEditada?.galeria || []);
  const [errorFotos, setErrorFotos] = useState<boolean>(false);
  const [titulo, setTitulo] = useState<string>(practicaEditada?.nombre || "");
  const [autores, setAutores] = useState<string[]>(practicaEditada?.participantes || []);
  const [errorAutores, setErrorAutores] = useState(false);
  const [fecha_inicio, setFecha_inicio] = useState<string>(practicaEditada?.fechaIni ? formatFechaToInputDate(practicaEditada.fechaIni) : "");
  const [fecha_fin, setFecha_fin] = useState<string>(practicaEditada?.fechaIni ? formatFechaToInputDate(practicaEditada.fechaIni) : "");
  const [errorFechas, setErrorFechas] = useState<string | null>(null);
  const [resumen, setResumen] = useState<string>(practicaEditada?.resumen || "");
  const [estado, setEstado] = useState<string>(practicaEditada?.estado || "");
  const [nivel, setNivel] = useState<string>(practicaEditada?.nivel === "ini" ? "Inicial" : practicaEditada?.nivel === "pro" ? "Profesional" : "");
  const [instituciones, setInstituciones] = useState<string[]>(practicaEditada?.instituciones?.map((institucion) => institucion.nombre) || []);
  const [errorInstituciones, setErrorInstituciones] = useState(false);
  const [etiquetas, setEtiquetas] = useState<string[]>(practicaEditada?.etiquetas || []);
  const [errorEtiquetas, setErrorEtiquetas] = useState(false);
  const [opcionesEtiquetas, setOpcionesEtiquetas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [opcionesInstituciones, setOpcionesInstituciones] = useState<InstitucionesDict>({});
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
    fetch(`${apiUrl}/sys_data/etiquetas_${"only_etiquetas"}`)
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
      .then((data: Institucion[]) => {  // Especificamos que 'data' es un arreglo de 'Institucion'
        // Crear un diccionario donde el nombre sea la key y la imagen el valor
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
        setFileNames(validFiles.map((file) => file.name)); // Actualiza los nombres de archivos

        // Generar paths de las imágenes
        const paths = validFiles.map((file) => `/imagenes_practicas/${nivel.toLowerCase()}/${file.name}`);
        setImagePaths(paths);

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
        setFileNames(["No se seleccionaron imágenes válidas"]);
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

    if (autores.length === 0) {
      setErrorAutores(true);
      if (!hasError) window.scrollTo(0, 310);
      hasError = true;
    } else {
      setErrorAutores(false);
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

    // Si no hay errores, continuar con el envío
    if (!hasError) {
      const practicaPayload = {
        nombre: titulo,
        resumen: resumen,
        fechaIni: fecha_inicio,
        fechaFin: fecha_fin,
        estado: estado,
        nivel: nivel,
        pdf: "",
        galeria: imagePaths,
        instituciones: instituciones.map(nombre => ({ nombre: nombre, imagen: opcionesInstituciones[nombre] })),
        participantes: autores,
        etiquetas: etiquetas
      }
      console.log(practicaPayload);

      try {
        const response = practicaEditada ?
          await fetch(`${apiUrl}/practicas/${practicaEditada.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(practicaPayload)
          }) :
          await fetch(`${apiUrl}/practicas`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(practicaPayload)
          });

        if (response.ok) {
          const data = await response.json();
          console.log(practicaEditada ? "Practica editada exitosamente" : "Practica creada exitosamente", data);
          navigate(-1);
        } else {
          console.error(practicaEditada ? "Error al editar la practica" : "Error al crear la practica", response.statusText);
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
        <h1>{practicaEditada ? "Editar Práctica" : "Crear Nueva Práctica"}</h1>
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
          <FontAwesomeIcon icon={faPen} className="icon" />
          <label htmlFor="autores" className="label">Autor(es):</label>
          <Autocomplete
            multiple
            id="autores"
            options={opcionesAutores}
            disableCloseOnSelect
            value={autores}
            onChange={(_event, value) => {
              setAutores(value);
              if (value.length > 0) setErrorAutores(false);
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
              <TextField {...params} label="Seleccione autores ... *" placeholder="Autores ..." error={errorAutores} helperText={errorAutores ? "Debe seleccionar al menos un autor" : ""} />
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
        {/* <div>
              <FontAwesomeIcon icon={faFileAlt} className="icon"/>
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
            </div> */}

        <div>
          <FontAwesomeIcon icon={faCircleCheck} className="icon" />
          <label htmlFor="estado" className="label">Estado:</label>
          <Autocomplete
            id="estado"
            options={opcionesEstado}
            className="dropdown"
            value={estado}
            onChange={(_event, value) => setEstado(value || "")}
            renderInput={(params) => <TextField {...params} required label="Seleccione un estado" />}
          />
        </div>
        <div>
          <FontAwesomeIcon icon={faUserGraduate} className="icon" />
          <label htmlFor="nivel" className="label">Nivel:</label>
          <Autocomplete
            id="nivel"
            options={["Inicial", "Profesional"]}
            className="dropdown"
            value={nivel}
            onChange={(_event, value) => setNivel(value || "")}
            renderInput={(params) => <TextField {...params} required label="Seleccione el nivel" />}
          />
        </div>
        <div>
          <FontAwesomeIcon icon={faSchool} className="icon" />
          <label htmlFor="instituciones" className="label">Institución(es):</label>
          <Autocomplete
            multiple
            id="instituciones"
            options={Object.keys(opcionesInstituciones)}
            disableCloseOnSelect
            value={instituciones}
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

export default NuevoPractica;

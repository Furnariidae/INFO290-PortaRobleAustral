import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faAt, faChevronLeft, faCircleCheck, faClipboard, faFileAlt, faFilePdf, faHeading, faList, faPen, faPlay, faSchool, faStop, faTags, faUpload, faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Integrante, Tesis } from "../../interfaces";
import "./nuevo.css";

interface Institucion {
  id: string;
  nombre: string;
  imagen: string;
}
type InstitucionesDict = {
  [key: string]: string;
};

const formatFechaToInputDate = (fecha: string) => {
  return fecha.split("T")[0];
};
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const NuevoTrabajoDeTitulo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trabajoEditado = location.state as Tesis | null;
  const [fileNames, setFileNames] = useState<string[]>(trabajoEditado?.galeria_imagenes?.map((imagen) => imagen.split("/").pop() || "") || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>(trabajoEditado?.galeria_imagenes || []);
  const [imagePaths, setImagePaths] = useState<string[]>(trabajoEditado?.galeria_imagenes || []);
  const [errorFotos, setErrorFotos] = useState<boolean>(false);
  const [titulo, setTitulo] = useState<string>(trabajoEditado?.titulo || "");
  const [autores, setAutores] = useState<string[]>(trabajoEditado?.participantes || []);
  const [errorAutores, setErrorAutores] = useState(false);
  const [fecha_inicio, setFecha_inicio] = useState<string>(trabajoEditado?.fecha_inicio ? formatFechaToInputDate(trabajoEditado.fecha_inicio) : "");
  const [fecha_fin, setFecha_fin] = useState<string>(trabajoEditado?.fecha_inicio ? formatFechaToInputDate(trabajoEditado.fecha_inicio) : "");
  const [errorFechas, setErrorFechas] = useState<string | null>(null);
  const [resumen, setResumen] = useState<string>(trabajoEditado?.resumen || "");
  const [cuerpo, setCuerpo] = useState<string>(trabajoEditado?.resumen || ""); //Borrar esto
  const [estado, setEstado] = useState<string>(trabajoEditado?.estado || "");
  const [grado, setGrado] = useState<string>(trabajoEditado?.nivel || "");
  const [tipo, setTipo] = useState<string>(trabajoEditado?.tipo || "");
  const [github, setGithub] = useState<string>(trabajoEditado?.url_github || "");
  const [tienePDF, setTienePDF] = useState<boolean>(trabajoEditado?.pdf || false);
  const [instituciones, setInstituciones] = useState<string[]>(trabajoEditado?.instituciones?.map((institucion) => institucion.nombre) || []);
  const [errorInstituciones, setErrorInstituciones] = useState(false);
  const [patrocinantes, setPatrocinantes] = useState<string[]>(trabajoEditado?.patrocinantes || []);
  const [errorPatrocinantes, setErrorPatrocinantes] = useState(false);
  const [copatrocinantes, setCopatrocinantes] = useState<string[]>(trabajoEditado?.copatrocinantes || []);
  const [errorCopatrocinantes, setErrorCopatrocinantes] = useState(false);
  const [etiquetas, setEtiquetas] = useState<string[]>(trabajoEditado?.etiquetas || []);
  const [errorEtiquetas, setErrorEtiquetas] = useState(false);
  const [opcionesEtiquetas, setOpcionesEtiquetas] = useState<string[]>([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [opcionesInstituciones, setOpcionesInstituciones] = useState<InstitucionesDict>({});
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);

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
    "Terminado",
    "En progreso",
    "No terminada",
  ];

  const grados = [
    "Pregrado",
    "Postgrado"
  ];

  // Extraer todos los nombres de los integrantes y ordenarlos alfabeticamente
  const opcionesAutores = integrantes.map((integrante) => integrante.nombre).sort((a, b) => a.localeCompare(b));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files); // Convierte FileList en un array
      const validFiles = files.filter((file) => file.type.startsWith("image/")); // Solo imágenes

      if (validFiles.length > 0) {
        setFileNames(validFiles.map((file) => file.name)); // Actualiza los nombres de archivos

        // Generar paths de las imágenes
        const paths = validFiles.map((file) => `/imagenes_tesis/${grado.toLowerCase()}/${file.name}`);
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
      const tesisPayload = {
        titulo: titulo,
        autor: "",
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        estado: estado,
        resumen: resumen,
        pdf: tienePDF,
        carta_apoyo: "",
        url_github: github,
        galeria_imagenes: imagePaths,
        participantes: autores,
        patrocinantes: patrocinantes,
        copatrocinantes: copatrocinantes,
        instituciones: instituciones.map(nombre => ({ nombre: nombre, imagen: opcionesInstituciones[nombre] })),
        nivel: grado,
        tipo: tipo,
        carrera: "",
        etiquetas: etiquetas
      }
      console.log(tesisPayload);
      console.log(opcionesInstituciones);
      try {
        const response = trabajoEditado ?
          await fetch(`${apiUrl}/tesis/${trabajoEditado.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(tesisPayload)
          }) :
          await fetch(`${apiUrl}/tesis`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(tesisPayload)
          });

        if (response.ok) {
          const data = await response.json();
          console.log(trabajoEditado ? "Trabajo de título editado exitosamente" : "Trabajo de título creado exitosamente", data);
          navigate(-1);
        } else {
          console.error(trabajoEditado ? "Error al editar el trabajo de título" : "Error al crear el trabajo de título", response.statusText);
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
        <h1>{trabajoEditado ? "Editar trabajo de título" : "Crear Nuevo trabajo de título"}</h1>
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
          // style={{ width:"237px", resize: "vertical" }}
          />
        </div>

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
          <label htmlFor="grado" className="label">Grado:</label>
          <Autocomplete
            id="grado"
            options={grados}
            className="dropdown"
            value={grado}
            onChange={(_event, value) => setGrado(value || "")}
            renderInput={(params) => <TextField {...params} required label="Seleccione el grado" />}
          />
        </div>
        <div>
          <FontAwesomeIcon icon={faList} className="icon" />
          <label htmlFor="tipo" className="label">Tipo:</label>
          <Autocomplete
            id="tipo"
            options={["Artículo", "Tesis"]}
            className="dropdown"
            value={tipo}
            onChange={(_event, value) => setTipo(value || "")}
            renderInput={(params) => <TextField {...params} required label="Seleccione el tipo" />}
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
          <FontAwesomeIcon icon={faFilePdf} className="icon" />
          <label htmlFor="pdf" className="label">¿Tiene PDF?</label>
          <div className="span-pdf">
            No
            <Switch checked={tienePDF} onChange={(e) => setTienePDF(e.target.checked)} />
            Si
          </div>
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

        <div>
          <FontAwesomeIcon icon={faAt} className="icon" />
          <label htmlFor="patrocinantes" className="label">Patrocinante(s):</label>
          <Autocomplete
            multiple
            id="patrocinantes"
            options={opcionesAutores}
            disableCloseOnSelect
            value={patrocinantes}
            onChange={(_event, value) => {
              setPatrocinantes(value);
              if (value.length > 0) setErrorPatrocinantes(false);
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
              <TextField {...params} label="Seleccione patrocinantes ... *" placeholder="Patrocinantes ..." error={errorPatrocinantes} helperText={errorPatrocinantes ? "Debe seleccionar al menos un autor" : ""} />
            )}
          />
        </div>

        <div>
          <FontAwesomeIcon icon={faAt} className="icon" />
          <label htmlFor="copatrocinantes" className="label">Copatrocinante(s):</label>
          <Autocomplete
            multiple
            id="copatrocinantes"
            options={opcionesAutores}
            disableCloseOnSelect
            value={copatrocinantes}
            onChange={(_event, value) => {
              setCopatrocinantes(value);
              if (value.length > 0) setErrorCopatrocinantes(false);
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
              <TextField {...params} label="Seleccione copatrocinantes ... *" placeholder="Copatrocinantes ..." error={errorCopatrocinantes} helperText={errorCopatrocinantes ? "Debe seleccionar al menos un Copatrocinante" : ""} />
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

export default NuevoTrabajoDeTitulo;

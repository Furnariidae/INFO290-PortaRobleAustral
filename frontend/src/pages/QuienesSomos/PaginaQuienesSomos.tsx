import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faEye, faUsers, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "./PaginaQuienesSomos.css";
import TarjetaIntegranteEquipo from "../../components/TarjetaIntegranteEquipo";
import quienesSomosData from "./quienes_somos.json";
import {formatDate} from "../../utils/dateUtils"
import { Integrante } from "../interfaces"

interface AccordionProps {
  section: {
    titulo: string;
    contenido: string;
    icon: any;
  };
}

const AccordionSection: React.FC<AccordionProps> = ({ section }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { titulo, contenido, icon } = section;

  return (
    <div className="accordion-container">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="accordion-title-container">
          <FontAwesomeIcon icon={icon} className="accordion-icon" />
          <span className="accordion-title">{titulo}</span>
        </div>
        <FontAwesomeIcon icon={faChevronDown} className={`accordion-arrow ${isOpen ? "open" : ""}`} />
      </button>
      <div className={`accordion-body ${isOpen ? "open" : ""}`} aria-expanded={isOpen}>
        {contenido}
      </div>
    </div>
  );
};

const PaginaQuienesSomos = () => {
  const [personas, setPersonas] = useState<Integrante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const personasPerPage = 15;

  const participanteSeleccionado = searchParams.get("participante");
  const tarjetaRef = useRef<HTMLDivElement | null>(null);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    fetch(`${apiUrl}/integrantes`)
      .then((response) => {
        if (!response.ok) throw new Error("Error en la solicitud");
        return response.json();
      })
      .then((data: Integrante[]) => {
        setPersonas(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Asegurarse de que las personas se ordenen correctamente en el frontend
  const personasConOrden = personas.filter((persona) => persona.orden !== undefined);
  const personasSinOrden = personas.filter((persona) => persona.orden === undefined);

  // Las personas con orden se colocan primero
  const sortedPersonas = [
    ...personasConOrden.sort((a, b) => (a.orden ?? Infinity) - (b.orden ?? Infinity)),
    ...personasSinOrden,
  ];
  

  // Lógica de paginación
  const totalPages = Math.ceil(sortedPersonas.length / personasPerPage);

  const displayedPersonas = sortedPersonas.slice(
    (currentPage - 1) * personasPerPage,
    currentPage * personasPerPage
  );

  useEffect(() => {
    if (participanteSeleccionado) {
      const selectedIndex = sortedPersonas.findIndex(
        (persona) => persona.nombre === participanteSeleccionado
      );

      if (selectedIndex !== -1) {
        const selectedPage = Math.floor(selectedIndex / personasPerPage) + 1;

        if (selectedPage !== currentPage) {
          setSearchParams(
            { page: selectedPage.toString(), participante: participanteSeleccionado },
            { replace: true }
          );
        } else {
          tarjetaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [participanteSeleccionado, sortedPersonas, currentPage]);

  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="quienes-somos-content">
      <AccordionSection section={{ titulo: quienesSomosData.quienesSomos.titulo, contenido: quienesSomosData.quienesSomos.contenido, icon: faUsers }} />
      <AccordionSection section={{ titulo: quienesSomosData.mision.titulo, contenido: quienesSomosData.mision.contenido, icon: faBullseye }} />
      <AccordionSection section={{ titulo: quienesSomosData.vision.titulo, contenido: quienesSomosData.vision.contenido, icon: faEye }} />

      <div className="colaboration-content">
        <div className="title-container">
          <h2>Nuestro Equipo</h2>
        </div>

        <div className="colaboration-grid-container">
          {displayedPersonas.map((persona, index) => (
            <div
              key={index}
              ref={persona.nombre === participanteSeleccionado ? tarjetaRef : null}
            >
              <TarjetaIntegranteEquipo
                id={persona.id}
                nombre={persona.nombre}
                profesion={persona.profesion}
                correo={persona.correo}
                linkedin={persona.linkedin}
                fecha={formatDate(persona.fecha)}
                imagen={persona.imagen}
                index={index}
                className={persona.nombre === participanteSeleccionado ? "resaltado" : ""}
              />
            </div>
          ))}
        </div>

        <Stack className="paginacion_mui" spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
            size="medium"
            shape="rounded"
          />
        </Stack>
      </div>
    </div>
  );
};


export default PaginaQuienesSomos;

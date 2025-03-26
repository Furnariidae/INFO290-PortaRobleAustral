import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faGear } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";


const NavSearchBar = () => {
    const navigate = useNavigate();
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: { [option: string]: boolean } }>({});
    const [searchText, setSearchText] = useState("");
    const [titulos, setTitulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [opciones, setOpciones] = useState([
        { opcion_name: "Etiquetas", selections: [] }
    ]);
    const apiUrl = process.env.REACT_APP_API_URL || "http://tu_api_url_por_defecto";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/titulos/`);
                if (!response.ok) throw new Error("Error al obtener datos del servidor");
                const data = await response.json();
                console.log(data);
                setTitulos(data);
            } catch (error) {
                console.error("Error al hacer fetch:", error);
            }
        };
        fetchData();
    }, [apiUrl]);

    useEffect(() => {
        const fetchEtiquetas = async () => {
            try {
                const response = await fetch(`${apiUrl}/sys_data/etiquetas_${"only_etiquetas"}`);
                if (!response.ok) throw new Error("Error en la solicitud");
                const data = await response.json();
                setOpciones((prevOpciones) => {
                    return prevOpciones.map((opcion) =>
                        opcion.opcion_name === "Etiquetas"
                            ? { ...opcion, selections: data.etiquetas }
                            : opcion
                    );
                });
                setLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                setError(error.message); // Accedes a la propiedad `message`
            } else {
                setError("Ha ocurrido un error desconocido");
            }
            setLoading(false);
            }
        };
        fetchEtiquetas();
    }, [apiUrl]);

    const handleSettingMenu = () => {
        setIsSettingOpen(!isSettingOpen);
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleCheckboxChange = (section: string, option: string) => {
        setSelectedOptions((prevSelected) => ({
            ...prevSelected,
            [section]: {
                ...prevSelected[section],
                [option]: !prevSelected[section]?.[option]
            }
        }));
    };

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const selectedTags = Object.values(selectedOptions).flatMap(section =>
        Object.entries(section).filter(([, isSelected]) => isSelected).map(([tag]) => tag)
    );

    const filteredElements = titulos.filter((element: any) => {
        const matchesTags = selectedTags.every(tag => element.etiquetas.includes(tag));
        const matchesText = element.titulo.toLowerCase().includes(searchText.toLowerCase());
        return matchesTags && matchesText;
    });

    const goToSearchResultsPage = () => {
        if ((searchText || selectedTags.length > 0)) {
            if (filteredElements.length > 0) {
                navigate("/resultados_busqueda", { state: { elementos: filteredElements } });
            } else {
                alert("No se encontraron elementos.");
            }
        } else {
            alert("Por favor, ingresa al menos una palabra o selecciona un tag.");
        }
    };

    return (
        <div className="search_related_container">
            <div className="search_container">
                <input
                    className="barra_busqueda"
                    type="text"
                    placeholder="Búsqueda..."
                    value={searchText}
                    onChange={handleSearchTextChange}
                />
                <button onClick={handleSettingMenu}>
                    <FontAwesomeIcon icon={faGear} />
                </button>
                <button onClick={goToSearchResultsPage}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
            {isSettingOpen && (
                <div className="settings_container">
                    {opciones.map((seccion) => (
                        <div key={seccion.opcion_name} className="settings_dropdown_section">
                            <div
                                onClick={() => toggleSection(seccion.opcion_name)}
                                className="setting_tag"
                            >
                                {seccion.opcion_name}
                            </div>
                            {openSection === seccion.opcion_name && (
                                <ul className="lista_tipoPublicacion">
                                    {seccion.selections.map((option) => (
                                        <li key={option}>
                                            {option}
                                            <input
                                                type="checkbox"
                                                checked={!!selectedOptions[seccion.opcion_name]?.[option]}
                                                onChange={() => handleCheckboxChange(seccion.opcion_name, option)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {searchText && (
                <div className="search_recommendations">
                    {filteredElements.map((element: { id_elem: string; titulo: string, url_path: string }) => (
                        <div className="recommendation_item">
                            <NavLink to={`/${element.url_path}${element.id_elem}`} > {element.titulo}</NavLink>
                        </div>
                    ))}
                    {filteredElements.length === 0 && <div>No se encontraron resultados.</div>}
                </div>
            )}
        </div>
    );
};

export default NavSearchBar;

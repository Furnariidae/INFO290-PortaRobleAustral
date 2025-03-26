import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

interface MenuItem {
    label: string;
    path: string;
    id: string;
    hasDropdown?: boolean;
    dropdownItems?: MenuItem[];
}

// interface Props {
//     nombre_clase: string;
//     toggleSearchBar: () => void;
//     isSearchOpen: boolean;
// }

const menuItems: MenuItem[] = [
    { label: "Proyectos", path: "/proyectos?page=1", id: "proyectos" },
    {
        label: "Trabajos de título",
        path: "#",
        id: "trabajos_titulo",
        hasDropdown: true,
        dropdownItems: [
            { label: "Pregrado", path: "/trabajos_de_titulo_pregrado", id: "trabajos_titulo_pregrado" },
            { label: "Postgrado", path: "/trabajos_de_titulo_postgrado", id: "trabajos_titulo_postgrado" },
        ]
    },
    {
        label: "Prácticas",
        path: "#",
        id: "practicas",
        hasDropdown: true,
        dropdownItems: [
            { label: "Iniciales", path: "/practicas_iniciales?page=1", id: "practicas_iniciales" },
            { label: "Profesionales", path: "/practicas_profesionales?page=1", id: "practicas_profesionales" },
        ]
    },
    { label: "Artículos", path: "/articulos?page=1", id: "articulos" },
    { label: "Colaboraciones", path: "/colaboraciones", id: "colaboraciones" },
    { label: "Interconexiones", path: "/interconexiones", id: "interconexiones" },
    { label: "Noticias", path: "/noticias?page=1", id: "noticias" },
    { label: "Quiénes Somos", path: "/quienes_somos?page=1", id: "quienes_somos" }
];

const MenuItemComponent: React.FC<{
    item: MenuItem;
    selectedItem: string | null;
    onItemClick: (id: string) => void;
}> = ({ item, selectedItem, onItemClick }) => {
    const isSelected = selectedItem === item.id;

    return item.hasDropdown ? (
        <li
            className={`dropdown ${isSelected ? "selected" : ""}`}
            onClick={() => onItemClick(item.id)}
        >
            {item.label} <FontAwesomeIcon icon={faCaretDown} />
            <ul className="dropdown-menu">
                {item.dropdownItems?.map((dropdownItem) => (
                    <NavLink
                        key={dropdownItem.id}
                        to={dropdownItem.path}
                        onClick={() => onItemClick(dropdownItem.id)}
                    >
                        <li className={selectedItem === dropdownItem.id ? "selected" : ""}>
                            {dropdownItem.label}
                        </li>
                    </NavLink>
                ))}
            </ul>
        </li>
    ) : (
        <NavLink to={item.path} onClick={() => onItemClick(item.id)}>
            <li className={isSelected ? "selected" : ""}>{item.label}</li>
        </NavLink>
    );
};

const NavBar_Menu = () => {
    const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

    const handleItemClick = (id: string) => {
        setSelectedItem(id);
    };

    return (
        <ul>
            {menuItems.map((item) => (
                <MenuItemComponent
                    key={item.id}
                    item={item}
                    selectedItem={selectedItem}
                    onItemClick={handleItemClick}
                />
            ))}
        </ul>
    );
};

export default NavBar_Menu;
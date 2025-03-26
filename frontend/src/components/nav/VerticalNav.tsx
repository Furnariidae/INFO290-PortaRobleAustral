import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavItems from "./NavItems";
import NavSearchBar from "./NavSearchBar";

interface VerticalNavProps {
    isVerticalMenuOpen: boolean;
    handleVerticalMenuOpen: () => void; // Añadido como prop para controlar el cierre desde Nav
}

const VerticalNav: React.FC<VerticalNavProps> = ({ isVerticalMenuOpen, handleVerticalMenuOpen }) => {

    return (
        <>
            {isVerticalMenuOpen && (
                <div className="VerticalNav_Content">
                    <button onClick={handleVerticalMenuOpen} style={{ marginRight:"30px",marginLeft:"auto", marginTop:"44px", scale:"2.5" }}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <NavItems />
                    <NavSearchBar />
                </div>
            )}



        </>
    );
};

export default VerticalNav;
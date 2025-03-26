import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./NavBar.css";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import HorizontalNav from "./HorizontalNav";
import VerticalNav from "./VerticalNav";

const Nav = () => {
  const [isVerticalMenuOpen, setIsVerticalMenuOpen] = useState(false); // Cambié el nombre para mayor claridad

  const handleVerticalMenuOpen = () => {
    setIsVerticalMenuOpen(!isVerticalMenuOpen); // Cambié setIsSearchOpen a setIsVerticalMenuOpen
  };

  return (
    <div className="NavBar_Container">
      <div className="NavBar_Logo_Container">
        <NavLink to={"/inicio"}><img src="/logo_pagina_negro.png" alt="logo" /></NavLink>
      </div>

      <nav>
        <div className="HorizontalNav_Container">
          <HorizontalNav />
        </div>

        <div className="VerticalNav_Container">
          <VerticalNav isVerticalMenuOpen={isVerticalMenuOpen} handleVerticalMenuOpen={handleVerticalMenuOpen} />
        </div>
      </nav>

      <button onClick={handleVerticalMenuOpen} className="VerticalNav_MenuIcon">
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
};

export default Nav;
import React, { useState } from "react"
import NavItems from "./NavItems"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import NavSearchBar from "./NavSearchBar";

const HorizontalNav = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen)
    }

    return (
        <>
            <div className="HorizontalNav">
                <NavItems />
                <button onClick={handleSearchToggle} style={{alignSelf:"center",height:"40px"}}>
                    <FontAwesomeIcon style={{marginLeft:"10px" ,marginRight:"10px", scale:"1.1", alignSelf:"center"}} icon={faMagnifyingGlass}/>
                </button>
            </div>
        
            {isSearchOpen && (
            <NavSearchBar />
        )}
        </>
    )
};

export default HorizontalNav;
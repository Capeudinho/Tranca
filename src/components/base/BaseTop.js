import React, {useContext} from "react";

import currentCentralContext from "../context/currentCentralContext";

import "../../css/base/baseTop.css";

function BaseTop ()
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);

    return (
        <header className = "header">
            <div className = "profileName">{currentCentral.name}</div>
        </header>
    ) 
}

export default BaseTop;
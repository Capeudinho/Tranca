import React from "react";

import "../../css/base/baseTop.css";

function BaseTop ()
{
    return (
        <header className = "header">
        <div className = "profileName">Rafael Carvalho</div>
        <button className = "search">Pesquisar</button>
        <button className = "menu">Menu</button>
        </header>
    ) 
}

export default BaseTop;
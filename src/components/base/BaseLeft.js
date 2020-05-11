import React from "react";
import {Link} from "react-router-dom";

import "../../css/base/baseLeft.css";

function BaseLeft ()
{
    return (
        <div className = "baseLeftArea">
            <div className = "area areaRecents">
                <Link to = "/">
                    <button className = "buttonList">Principal</button>
                </Link>
            </div>
            <div className = "area areaGroups">
                <Link to = "/groups">
                    <button className = "buttonList">Grupos</button>
                </Link>
            </div>
            <div className = "area areaUsers">
                <Link to = "/listusers">
                    <button className = "buttonList">Usuários</button>
                </Link>
                <Link to = "/adduser">
                    <button className = "buttonAdd">+</button>
                </Link>
            </div>
            <div className = "area areaRoles">
                <button className = "buttonList">Funções</button>
                <button className = "buttonAdd">+</button>
            </div>
            <div className = "area areaMenu">
                <button className = "buttonList buttonListMenu">Menu</button>
            </div>
        </div>
    )
}

export default BaseLeft;
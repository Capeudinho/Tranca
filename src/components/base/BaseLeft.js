import React, {useState} from "react";
import {Link} from "react-router-dom";

function BaseLeft ()
{
    return (
        <>
            <div className = "area areaRecents">
                <Link to = "/">
                    <button className = "fileButtonMain">Recentes</button>
                </Link>
            </div>

            <div className = "area areaGroups">
                <button className = "fileButtonMain">Grupos</button>
                <button className = "fileButtonAdd">Adicionar</button>
            </div>

            <div className = "area areaUsers">
                <Link to = "/listusers">
                    <button className = "fileButtonMain">Usuários</button>
                </Link>
                <Link to = "/adduser">
                    <button className = "fileButtonAdd">Adicionar</button>
                </Link>
            </div>
            
            <div className = "area areaRoles">
                <button className = "fileButtonMain">Funções</button>
                <button className = "fileButtonAdd">Adicionar</button>
            </div>
        </>
    )
}

export default BaseLeft;
import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";

import "../../css/role/roleSearchBar.css";

function RoleSearchBar ({match})
{
    const [name, setName] = useState ("");

    useEffect
    (
        () =>
        {
            if (match.params.hasOwnProperty ("name"))
            {
                setName (match.params.name);
            }
        },
        []
    )

    function handleChangeName (e)
    {
        const value = e.target.value;
        setName (value);
    }

    function newUrl ()
    {
        if (name === "")
        {
            return "/listroles";
        }
        else
        {
            return `/searchroles/${name}`;
        }
    }

    return (
        <div className = "roleSearchBarArea">
            <form className = "nameInputGroup">
                <label>Nome</label>
                <input
                value = {name}
                onChange = {(e) => handleChangeName (e)}
                placeholder = "Nome"
                required
                />
                <Link to = {newUrl ()}>
                    <button className = "buttonSearch">Pesquisar</button>
                </Link>
            </form>
            <Link to = {`${match.url}/addrole`}>
                <button className = "buttonAdd buttonAddRole">
                    Função
                </button>
            </Link>
        </div>
    )
}

export default RoleSearchBar;
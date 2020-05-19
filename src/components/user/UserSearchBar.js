import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";

import "../../css/user/userSearchBar.css";

function UserSearchBar ({match})
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
            return "/listusers";
        }
        else
        {
            return `/searchusers/${name}`;
        }
    }

    return (
        <div className = "userSearchBarArea">
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
            <Link to = {`${match.url}/adduser`}>
                <button className = "buttonAdd buttonAddUser">
                    Usuário
                </button>
            </Link>
        </div>
    )
}

export default UserSearchBar;
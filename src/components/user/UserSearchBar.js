import React, {useState} from "react";
import {Link} from "react-router-dom";

import "../../css/user/userSearchBar.css";

function UserSearchBar ()
{
    const [name, setName] = useState ("");

    function handleChangeName (e)
    {
        const value = e.target.value;
        setName (value);
    }

    return (
        <div className = "userSearchBarArea">
            <form className = "nameInputGroup">
                <label>Nome</label>
                <input
                onChange = {(e) => handleChangeName (e)}
                placeholder = "Nome"
                required
                />
                <Link to = {`/searchusers/${name}`}>
                    <button className = "buttonSearch">Pesquisar</button>
                </Link>
            </form>
        </div>
    )
}

export default UserSearchBar;
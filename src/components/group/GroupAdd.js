import React, {useState, useContext} from "react";
import api from "../../services/api";

import addedGroupContext from "../context/addedGroupContext";

import "../../css/group/groupAdd.css";

function GroupAdd ({match})
{
    const {addedGroup, setAddedGroup} = useContext (addedGroupContext);
    const [name, setName] = useState ("");
    
    function handleChangeName (e)
    {
        const value = e.target.value;
        setName (value);
    }

    async function handleSubmit (e)
    {
        e.preventDefault ();
        const _id = match.params.id;
        const response = await api.post
        (
            "/groupstore",
            {
                name,
                _id
            }
        );
        if (response.data === "")
        {
            window.alert("Já existe um grupo com esse nome.");
        }
        else
        {
            window.alert(`O grupo ${name} foi criado.`);
            document.getElementById ("groupAdd").reset();
            setAddedGroup (response.data);
        }
    }

    return (
        <div className = "GroupAddArea">
            <form id = "groupAdd">
                <div className = "nameInputGroup">
                    <label htmlFor = "name">Nome</label>
                    <input
                        form = "groupAdd"
                        placeholder = "Nome"
                        className = "nameInput"
                        value = {name}
                        onChange = {(e) => handleChangeName (e)}
                        pattern = "[A-Za-z0-9_]{3,}"
                        required
                    />
                </div>
                <button
                className = "buttonSubmit"
                type = "submit"
                onClick = {(e) => handleSubmit (e)}
                >
                    Criar
                </button>
            </form>
        </div>
    )
}

export default GroupAdd;
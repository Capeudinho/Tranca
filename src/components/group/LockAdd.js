import React, {useState, useContext} from "react";
import api from "../../services/api";

import currentCentralContext from "../context/currentCentralContext";
import addedLockContext from "../context/addedLockContext";

import "../../css/group/lockAdd.css";

function LockAdd ({match})
{
    
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {addedLock, setAddedLock} = useContext (addedLockContext);
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
        const owner = currentCentral._id;
        const response = await api.post
        (
            "/lockstore",
            {
                name,
                _id,
                owner
            }
        );
        if (response.data === "")
        {
            window.alert("Já existe uma tranca com esse nome.");
        }
        else
        {
            window.alert(`A tranca ${name} foi criada.`);
            document.getElementById ("lockAdd").reset();
            setAddedLock (response.data);
        }
    }

    return (
        <div className = "lockAddArea">
            <form id = "lockAdd">
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
                    Criar tranca
                </button>
            </form>
        </div>
    )
}

export default LockAdd;
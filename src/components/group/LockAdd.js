import React, {useState, useContext} from "react";
import api from "../../services/api";

import currentCentralContext from "../context/currentCentralContext";
import addedLockContext from "../context/addedLockContext";
import messageContext from "../context/messageContext";

import "../../css/group/lockAdd.css";

function LockAdd ({match})
{
    
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {addedLock, setAddedLock} = useContext (addedLockContext);
    const {message, setMessage} = useContext (messageContext);
    const [name, setName] = useState ("");
    const [validName, setValidName] = useState (true);

    function checkName (name)
    {
        if (name.length > 0)
        {
            setValidName (true);
            return true;
        }
        setValidName (false);
        return false;
    }
    
    function handleChangeName (e)
    {
        const value = e.target.value;
        checkName (value);
        setName (value);
    }

    async function handleSubmit (e)
    {
        e.preventDefault ();
        if (checkName (name))
        {
            const response = await api.post
            (
                "/lockstore",
                {
                    name,
                    _id: match.params.id,
                    owner: currentCentral._id
                }
            );
            if (response.data.hasOwnProperty ("newLock") === false)
            {
                setMessage (`Já existe uma tranca com o nome ${name}.`);
            }
            else
            {
                setAddedLock (response.data);
                setMessage (`A tranca ${name} foi criada.`);
            }
        }
        else
        {
            setMessage ("Um ou mais campos são inválidos.");
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
                        onChange = {(e) => {handleChangeName (e)}}
                        value = {name}
                        style = {{borderColor: validName ? "#cccccc" : "#cc5151"}}
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
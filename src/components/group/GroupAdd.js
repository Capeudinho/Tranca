import React, {useState, useContext} from "react";
import api from "../../services/api";

import currentCentralContext from "../context/currentCentralContext";
import allRolesContext from "../context/allRolesContext";
import addedGroupContext from "../context/addedGroupContext";
import messageContext from "../context/messageContext";

import "../../css/group/groupAdd.css";

function GroupAdd ({match})
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {allRoles, setAllRoles} = useContext (allRolesContext);
    const {addedGroup, setAddedGroup} = useContext (addedGroupContext);
    const {message, setMessage} = useContext (messageContext);
    const [name, setName] = useState ("");
    const [roles, setRoles] = useState ([]);
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

    function handleChangeRole (index, e)
    {
        const newRoles = [...roles];
        allRoles.map
        (
            (role) =>
            {
                if (role._id === e.target.options[e.target.selectedIndex].id)
                {
                    newRoles[index] = role;
                }
            }
        )
        setRoles (newRoles);
    }

    function handleAddRole ()
    {
        if (allRoles.length === 0)
        {
            setMessage ("Você não possui papéis criados.");
        }
        else
        {
            const newRoles = [...roles];
            newRoles.push (allRoles[0]);
            setRoles (newRoles);
        }
    }

    function handleRemoveRole (index)
    {
        
        const newRoles = [...roles];
        newRoles.splice (index, 1);
        setRoles (newRoles);
    }

    async function handleSubmit (e)
    {
        e.preventDefault ();
        if (checkName (name))
        {
            const response = await api.post
            (
                "/groupstore",
                {
                    name,
                    roles,
                    _id: match.params.id,
                    owner: currentCentral._id
                }
            );
            if (response.data.hasOwnProperty ("newGroup") === false)
            {
                setMessage (`Já existe um grupo com o nome ${name}.`);
            }
            else
            {
                setAddedGroup (response.data);
                setMessage (`O grupo ${name} foi criado.`);
            }
        }
        else
        {
            setMessage ("Um ou mais campos são inválidos.");
        }
    }

    return (
        <div className = "groupAddArea">
            <form id = "groupAdd">
                <div className = "nameInputGroup">
                    <label htmlFor = "name">Nome</label>
                    <input
                        form = "groupAdd"
                        placeholder = "Nome"
                        className = "nameInput"
                        value = {name}
                        style = {{borderColor: validName ? "#cccccc" : "#cc5151"}}
                        onChange = {(e) => {handleChangeName (e)}}
                    />
                </div>
                <div className = "roleInputGroup">
                {
                    roles.map
                    (
                        (role, index) =>
                        {
                            return (
                                <div className = "singleRole" key = {index}>
                                    <label htmlFor = "role">Papel {index+1}</label>
                                    <select
                                    className = "roleSelect"
                                    value = {role.name}
                                    onChange = {(e) => {handleChangeRole (index, e)}}
                                    >
                                        {
                                            allRoles.map
                                            (
                                                (optionRole, optionIndex) =>
                                                {
                                                    return (
                                                        <option
                                                        id = {optionRole._id}
                                                        key = {optionIndex}
                                                        value = {optionRole.name}
                                                        >
                                                            {optionRole.name}
                                                        </option>
                                                    )
                                                }
                                            )
                                        }
                                    </select>
                                    <button
                                    className = "buttonRoleRemove"
                                    type = "button"
                                    onClick = {() => {handleRemoveRole (index)}}
                                    >
                                        X
                                    </button>
                                </div>
                            );
                        }
                    )
                }
                </div>
                <button
                className = "buttonRoleAdd"
                type = "button"
                onClick = {() => handleAddRole ()}
                >
                    Adicionar papel
                </button>
                <button
                className = "buttonSubmit"
                type = "submit"
                onClick = {(e) => handleSubmit (e)}
                >
                    Criar grupo
                </button>
            </form>
        </div>
    )
}

export default GroupAdd;
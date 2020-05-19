import React, {useState, useContext} from "react";
import api from "../../services/api";

import allRolesContext from "../context/allRolesContext";
import addedGroupContext from "../context/addedGroupContext";

import "../../css/group/groupAdd.css";

function GroupAdd ({match})
{
    const {allRoles, setAllRoles} = useContext (allRolesContext);
    const {addedGroup, setAddedGroup} = useContext (addedGroupContext);
    const [name, setName] = useState ("");
    const [roles, setRoles] = useState ([]);
    
    function handleChangeName (e)
    {
        const value = e.target.value;
        setName (value);
    }

    function handleChangeRole (index, e)
    {
        const newRoles = [...roles];
        allRoles.map
        (
            (role) =>
            {
                if (role._id == e.target.options[e.target.selectedIndex].id)
                {
                    newRoles[index] = role;
                }
            }
        )
        setRoles (newRoles);
    }

    function handleAddRole ()
    {
        const newRoles = [...roles];
        newRoles.push (allRoles[0]);
        setRoles (newRoles);
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
        const _id = match.params.id;
        const response = await api.post
        (
            "/groupstore",
            {
                name,
                roles,
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
        <div className = "groupAddArea">
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
                                    onChange = {(e) => handleChangeRole (index, e)}
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
                                    onClick = {() => handleRemoveRole (index)}
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
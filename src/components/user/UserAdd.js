import React, {useState, useContext} from "react";
import api from "../../services/api";

import allRolesContext from "../context/allRolesContext";
import addedUserContext from "../context/addedUserContext";

import "../../css/user/userAdd.css";

function UserAdd ()
{
    const {allRoles, setAllRoles} = useContext (allRolesContext);
    const {addedUser, setAddedUser} = useContext (addedUserContext);
    const [name, setName] = useState ("");
    const [email, setEmail] = useState ("");
    const [MACs, setMACs] = useState ([]);
    const [roles, setRoles] = useState ([]);

    function handleChangeName (e)
    {
        const value = e.target.value;
        setName (value);
    }

    function handleChangeEmail (e)
    {
        const value = e.target.value;
        setEmail (value);
    }

    function handleChangeMAC (index, e)
    {
        const values = [...MACs];
        values[index] = e.target.value;
        setMACs (values);
    }

    function handleAddMAC ()
    {
        const values = [...MACs];
        values.push ("");
        setMACs (values);
    }

    function handleRemoveMAC (index)
    {
        const values = [...MACs];
        values.splice (index, 1);
        setMACs (values);
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
        const response = await api.post
        (
            "/userstore",
            {
                name,
                email,
                MACs,
                roles
            }
        );
        if (response.data === "")
        {
            window.alert ("Já existe um usuário com esse nome.");
        }
        else
        {
            window.alert (`O usuário ${name} foi criado.`);
            setAddedUser (response.data);
            document.getElementById ("userAdd").reset();
        }
    }

    return (
        <div className = "userAddArea">
            <form id = "userAdd">
                <div className = "nameInputGroup">
                    <label htmlFor = "name">Nome</label>
                    <input
                        form = "userAdd"
                        placeholder = "Nome"
                        className = "nameInput"
                        value = {name}
                        onChange = {(e) => handleChangeName (e)}
                        pattern = "[A-Za-z0-9_]{3,}"
                        required
                    />
                </div>
                <div className = "emailInputGroup">
                    <label htmlFor = "email">E-mail</label>
                    <input
                        form = "userAdd"
                        placeholder = "E-mail"
                        className = "emailInput"
                        value = {email}
                        onChange = {(e) => handleChangeEmail (e)}
                        type = "email"
                        required
                   />
                </div>
                {
                    MACs.map
                    (
                        (MAC, index) =>
                        {
                            return (
                                <div className = "singleMAC" key = {index}>
                                    <label htmlFor = "MAC">MAC {index+1}</label>
                                    <input
                                        form = "userAdd"
                                        className = "MACInput"
                                        value = {MAC}
                                        placeholder = "MAC"
                                        onChange = {(e) => handleChangeMAC (index, e)}
                                    />
                                    <button
                                    className = "buttonMACRemove"
                                    type = "button"
                                    onClick = {() => handleRemoveMAC (index)}
                                    >
                                        X
                                    </button>
                                </div>
                            );
                        }
                    )
                }
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
                <div className = "buttonsMain">
                    <button
                    className = "buttonMACAdd"
                    type = "button"
                    onClick = {() => handleAddMAC ()}
                    >
                        Adicionar MAC
                    </button>
                    <button
                    className = "buttonRoleAdd"
                    type = "button"
                    onClick = {() => handleAddRole ()}
                    >
                        Adicionar papel
                    </button>
                </div>
                <button
                className = "buttonSubmit"
                type = "submit"
                onClick = {(e) => handleSubmit (e)}
                >
                    Criar usuário
                </button>
            </form>
        </div>
    )
}

export default UserAdd;
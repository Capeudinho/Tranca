import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import allRolesContext from "../context/allRolesContext";
import updatedUserContext from "../context/updatedUserContext";

import "../../css/user/userEdit.css";

function UserEdit ({match})
{
    const {allRoles, setAllRoles} = useContext (allRolesContext);
    const {updatedUser, setUpdatedUser} = useContext (updatedUserContext);
    const [user, setUser] = useState ({});
    const [roles, setRoles] = useState ([]);
    const [update, setUpdate] = useState (0);

    useEffect
    (
        () =>
        {
            const runEffect = async () =>
            {
                var _id = match.params.id;
                const response = await api.get
                (
                    "/useridindex",
                    {
                        params:
                        {
                            _id
                        }
                    }
                );
                setUser (response.data);
                for (var k = 0; k < response.data.roles.length; k++)
                {
                    for (var j = 0; j < allRoles.length; j++)
                    {
                        if (response.data.roles[k] == allRoles[j]._id)
                        {
                            var tempRoles = roles;
                            tempRoles.push (allRoles[j]);
                            setRoles (tempRoles);
                        }
                    }
                }
                setUpdate (update+1);
            }
            runEffect();
        },
        [match.params.id]
    )

    function handleChangeName (e)
    {
        var newUser = Object.assign ({}, user);
        newUser.name = e.target.value;
        setUser (newUser);
    }

    function handleChangeEmail (e)
    {
        var newUser = Object.assign ({}, user);
        newUser.email = e.target.value;
        setUser (newUser);
    }

    function handleChangeMAC (index, e)
    {
        const values = [...user.MACs];
        values[index] = e.target.value;
        var newUser = Object.assign ({}, user);
        newUser.MACs = values;
        setUser (newUser);
    }

    function handleAddMAC ()
    {
        const values = [...user.MACs];
        values.push ("");
        var newUser = Object.assign ({}, user);
        newUser.MACs = values;
        setUser (newUser);
    }

    function handleRemoveMAC (index)
    {
        const values = [...user.MACs];
        values.splice (index, 1);
        var newUser = Object.assign ({}, user);
        newUser.MACs = values;
        setUser (newUser);
    }

    function handleChangeRole (index, e)
    {
        const values = [...user.roles];
        values[index] = e.target.options[e.target.selectedIndex].id;
        var newUser = Object.assign ({}, user);
        newUser.roles = values;
        setUser (newUser);
        const newRoles = roles;
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
        const values = [...user.roles];
        values.push (allRoles[0]);
        var newUser = Object.assign ({}, user);
        newUser.roles = values;
        setUser (newUser);
        const newRoles = roles;
        newRoles.push (allRoles[0]);
        setRoles (newRoles);
    }

    function handleRemoveRole (index)
    {
        const values = [...user.roles];
        values.splice (index, 1);
        var newUser = Object.assign ({}, user);
        newUser.roles = values;
        setUser (newUser);
        const newRoles = roles;
        newRoles.splice (index, 1);
        setRoles (newRoles);
    }

    async function handleSubmit (e)
    {
        try
        {
            e.preventDefault ();
            const _id = user._id;
            const name = user.name;
            const email = user.email;
            const MACs = user.MACs;
            const roles = user.roles;
            const response = await api.put
            (
                "/useridupdate",
                {
                    name,
                    email,
                    MACs,
                    roles
                },
                {
                    params:
                    {
                        _id
                    }
                }
            );
            if (response.data !== null)
            {
                window.alert(`O usuário ${user.name} foi atualizado.`);
                setUpdatedUser (user);
            }
        }
        catch (error)
        {
            throw new Error(error);
        }
    }

    function OtherAttributes ()
    {
        if (user !== null && user !== undefined && user.hasOwnProperty ("MACs") && user.hasOwnProperty ("roles"))
        {
            return (
                <div>
                {
                    user.MACs.map
                    (
                        (MAC, index) =>
                        {
                            return (
                                <div className = "singleMAC" key = {index}>
                                    <label htmlFor = "MAC">MAC {index+1}</label>
                                    <input
                                        form = "userEdit"
                                        className = "MACInput"
                                        value = {MAC || ""}
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
                </div>
            )
        }
        else
        {
            return <div/>
        }
    }

    return (
        <div className = "userEditArea">
            <form id = "userEdit">
                <div className = "nameInputGroup">
                    <label htmlFor = "name">Nome</label>
                    <input
                        form = "userEdit"
                        placeholder = "Nome"
                        className = "nameInput"
                        value = {user.name || ""}
                        onChange = {(e) => handleChangeName (e)}
                        pattern = "[A-Za-z0-9_]{3,} "
                        required
                    />
                </div>
                <div className = "emailInputGroup">
                    <label htmlFor = "email">E-mail</label>
                    <input
                        form = "userEdit"
                        placeholder = "E-mail"
                        className = "emailInput"
                        value = {user.email || ""}
                        onChange = {(e) => handleChangeEmail (e)}
                        type = "email"
                        required
                   />
                </div>
                <OtherAttributes/>
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
                <Link to = {match.url.replace ("edit", "")}>
                    <button
                    className = "buttonSubmit"
                    type = "submit"
                    onClick = {(e) => handleSubmit (e)}
                    >
                        Salvar
                    </button>
                </Link>
            </form>
        </div>
    )
}

export default UserEdit;
import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import currentCentralContext from "../context/currentCentralContext";
import allRolesContext from "../context/allRolesContext";
import updatedUserContext from "../context/updatedUserContext";
import messageContext from "../context/messageContext";

import "../../css/user/userEdit.css";

function UserEdit ({match})
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {allRoles, setAllRoles} = useContext (allRolesContext);
    const {message, setMessage} = useContext (messageContext);
    const {updatedUser, setUpdatedUser} = useContext (updatedUserContext);
    const [user, setUser] = useState
    (
        {
            name: "",
            email: "",
            MACs: [],
            roles: []
        }
    );
    const [roles, setRoles] = useState ([]);
    const [validName, setValidName] = useState (true);
    const [validEmail, setValidEmail] = useState (true);

    useEffect
    (
        () =>
        {
            let mounted = true;
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
                if (mounted)
                {
                    for (var k = 0; k < response.data.roles.length; k++)
                    {
                        for (var j = 0; j < allRoles.length; j++)
                        {
                            if (response.data.roles[k] === allRoles[j]._id)
                            {
                                var tempRoles = roles;
                                tempRoles.push (allRoles[j]);
                                setRoles (tempRoles);
                            }
                        }
                    }
                    setUser (response.data);
                }
            }
            runEffect();
            return (() => {mounted = false;});
        },
        [match.params.id]
    );

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

    function checkEmail (email)
    {
        const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regularExpression.test (String (email).toLowerCase ()))
        {
            setValidEmail (true);
            return true;
        }
        setValidEmail (false);
        return false;
    }

    function handleChangeName (e)
    {
        var newUser = Object.assign ({}, user);
        newUser.name = e.target.value;
        checkName (e.target.value);
        setUser (newUser);
    }

    function handleChangeEmail (e)
    {
        var newUser = Object.assign ({}, user);
        newUser.email = e.target.value;
        checkEmail (e.target.value);
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
            const values = [...user.roles];
            values.push (allRoles[0]);
            var newUser = Object.assign ({}, user);
            newUser.roles = values;
            setUser (newUser);
            const newRoles = roles;
            newRoles.push (allRoles[0]);
            setRoles (newRoles);
        }
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
        e.preventDefault ();
        if (checkName (user.name) && checkEmail (user.email))
        {
            const response = await api.put
            (
                "/useridupdate",
                {
                    name: user.name,
                    email: user.email,
                    MACs: user.MACs,
                    roles: user.roles,
                    owner: currentCentral._id
                },
                {
                    params:
                    {
                        _id: user._id
                    }
                }
            );
            if (response.data === "")
            {
                setMessage (`Já existe um usuário com o nome ${user.name}.`);
            }
            else
            {
                setUpdatedUser (user);
                setMessage (`O usuário ${user.name} foi atualizado.`);
            }
        }
        else
        {
            setMessage ("Um ou mais campos são inválidos.");
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
                        value = {user.name}
                        style = {{borderColor: validName ? "#cccccc" : "#cc5151"}}
                        onChange = {(e) => {handleChangeName (e)}}
                    />
                </div>
                <div className = "emailInputGroup">
                    <label htmlFor = "email">E-mail</label>
                    <input
                        form = "userEdit"
                        placeholder = "E-mail"
                        className = "emailInput"
                        value = {user.email}
                        style = {{borderColor: validEmail ? "#cccccc" : "#cc5151"}}
                        onChange = {(e) => {handleChangeEmail (e)}}
                   />
                </div>
                {
                    user.MACs.map
                    (
                        (MAC, index) =>
                        {
                            return (
                                <div className = "singleMAC" key = {"singleMAC"+index}>
                                    <label htmlFor = "MAC">MAC {index+1}</label>
                                    <input
                                        form = "userEdit"
                                        className = "MACInput"
                                        value = {MAC || ""}
                                        placeholder = "MAC"
                                        onChange = {(e) => {handleChangeMAC (index, e)}}
                                    />
                                    <button
                                    className = "buttonMACRemove"
                                    type = "button"
                                    onClick = {() => {handleRemoveMAC (index)}}
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
                                <div className = "singleRole" key = {"singleRole"+index}>
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
                <div className = "buttonsMain">
                    <button
                    className = "buttonMACAdd"
                    type = "button"
                    onClick = {() => {handleAddMAC ()}}
                    >
                        Adicionar MAC
                    </button>
                    <button
                    className = "buttonRoleAdd"
                    type = "button"
                    onClick = {() => {handleAddRole ()}}
                    >
                        Adicionar papel
                    </button>
                </div>
                <Link to = {match.url.replace ("edit", "")}>
                    <button
                    className = "buttonSubmit"
                    type = "submit"
                    onClick = {(e) => {handleSubmit (e)}}
                    >
                        Salvar
                    </button>
                </Link>
            </form>
        </div>
    )
}

export default UserEdit;
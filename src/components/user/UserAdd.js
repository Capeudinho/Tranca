import React, {useState, useContext} from "react";
import api from "../../services/api";

import currentCentralContext from "../context/currentCentralContext";
import allRolesContext from "../context/allRolesContext";
import addedUserContext from "../context/addedUserContext";
import messageContext from "../context/messageContext";

import "../../css/user/userAdd.css";

function UserAdd ()
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {allRoles, setAllRoles} = useContext (allRolesContext);
    const {addedUser, setAddedUser} = useContext (addedUserContext);
    const {message, setMessage} = useContext (messageContext);
    const [name, setName] = useState ("");
    const [email, setEmail] = useState ("");
    const [MACs, setMACs] = useState ([]);
    const [roles, setRoles] = useState ([]);
    const [validName, setValidName] = useState (true);
    const [validEmail, setValidEmail] = useState (true);

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
        const value = e.target.value;
        checkName (value);
        setName (value);
    }

    function handleChangeEmail (e)
    {
        const value = e.target.value;
        checkEmail (value);
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
            setRoles (newRoles);
            newRoles.push (allRoles[0]);
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
        if (checkName (name) && checkEmail (email))
        {
            const response = await api.post
            (
                "/userstore",
                {
                    name,
                    email,
                    MACs,
                    roles,
                    owner: currentCentral._id
                }
            );
            if (response.data === "")
            {
                setMessage (`Já existe um usuário com o nome ${name}.`);
            }
            else
            {
                setAddedUser (response.data);
                setMessage (`O usuário ${name} foi criado.`);
            }
        }
        else
        {
            setMessage ("Um ou mais campos são inválidos.");
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
                        style = {{borderColor: validName ? "#cccccc" : "#cc5151"}}
                        onChange = {(e) => {handleChangeName (e)}}
                    />
                </div>
                <div className = "emailInputGroup">
                    <label htmlFor = "email">E-mail</label>
                    <input
                        form = "userAdd"
                        placeholder = "E-mail"
                        className = "emailInput"
                        value = {email}
                        style = {{borderColor: validEmail ? "#cccccc" : "#cc5151"}}
                        onChange = {(e) => {handleChangeEmail (e)}}
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
                <button
                className = "buttonSubmit"
                type = "submit"
                onClick = {(e) => {handleSubmit (e)}}
                >
                    Criar usuário
                </button>
            </form>
        </div>
    )
}

export default UserAdd;
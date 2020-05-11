import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import updatedUserContext from "../context/updatedUserContext";

import "../../css/user/userEdit.css";

function UserEdit ({match})
{
    const {updatedUser, setUpdatedUser} = useContext (updatedUserContext);
    const [getUser, setGetUser] = useState ({});
    const [user, setUser] = useState ({});
    const [_id, set_id] = useState ("");

    useEffect
    (
        () =>
        {
            if (user.hasOwnProperty ("_id") === false)
            {
                set_id (match.params.id);
            }
            else
            {
                if (user._id !== match.params.id)
                {
                    set_id (match.params.id);
                }
            }
            const runEffect = async () =>
            {
                const response = await api.get
                (
                    "/useridindex",
                    {
                        params:
                        {
                            _id
                        }
                    }
                )
                if (user.hasOwnProperty ("name") === false)
                {
                    setGetUser (response.data);
                    var newUser = Object.assign ({}, user);
                    newUser.MACs = [];
                    setUser (newUser);
                }
                else
                {
                    if (user.name !== response.data.name)
                    {
                        setGetUser (response.data);
                    }
                }
            }
            runEffect();
            setUser (getUser);
        },
        [_id, getUser]
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

    async function handleSubmit (e)
    {
        try
        {
            e.preventDefault ();
            const _id = user._id;
            const name = user.name;
            const email = user.email;
            const MACs = user.MACs;
            const response = await api.put
            (
                "/useridupdate",
                {
                    name,
                    email,
                    MACs
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

    var userMACsToList;
    if (user.MACs !== undefined && user.MACs !== null)
    {
        userMACsToList = user.MACs.map
        (
            (MAC, index) =>
            {
                return (
                    <div className = "singleMAC" key = {index}>
                        <label htmlFor = "MAC">MAC {index+1}</label>
                        <input
                            form = "userAdd"
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
                <div>{userMACsToList}</div>
                <div className = "buttonsMain">
                    <button
                    className = "buttonMACAdd"
                    type = "button"
                    onClick = {() => handleAddMAC ()}
                    >
                        Adicionar MAC
                    </button>
                    <Link to = {match.url.replace ("edit", "")}>
                        <button
                        className = "buttonSubmit"
                        type = "submit"
                        onClick = {(e) => handleSubmit (e)}
                        >
                            Salvar
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default UserEdit;
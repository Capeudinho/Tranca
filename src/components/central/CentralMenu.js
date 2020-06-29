import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import currentCentralContext from "../context/currentCentralContext";

import "../../css/central/centralMenu.css";

function CentralMenu ()
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const [show, setShow] = useState (false);
    const [newCentral, setNewCentral] = useState
    (
        {
            name: "",
            email: "",
            password: ""
        }
    );

    useEffect
    (
        () =>
        {
            setNewCentral (currentCentral);
        },
        []
    )

    function handleNameChange (e)
    {
        var tempCentral = Object.assign ({}, newCentral);
        tempCentral.name = e.target.value;
        setNewCentral (tempCentral);
    }

    function handleEmailChange (e)
    {
        var tempCentral = Object.assign ({}, newCentral);
        tempCentral.email = e.target.value;
        setNewCentral (tempCentral);
    }

    function handlePasswordChange (e)
    {
        var tempCentral = Object.assign ({}, newCentral);
        tempCentral.password = e.target.value;
        setNewCentral (tempCentral);
    }

    async function handleSubmit (e)
    {
        try
        {
            e.preventDefault ();
            const _id = newCentral._id;
            const name = newCentral.name;
            const email = newCentral.email;
            const password = newCentral.password;
            const response = await api.put
            (
                "/centralidupdate",
                {
                    name,
                    email,
                    password
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
                window.alert("A sua conta foi atualizada.");
                setCurrentCentral (response.data);
            }
        }
        catch (error)
        {
            throw new Error(error);
        }
    }

    async function handleDelete (_id)
    {
        if (window.confirm ("Você realmente deseja excluir sua conta?"))
        {
            const _id = newCentral._id;
            const response = await api.delete
            (
                "/centraliddestroy",
                {
                    params:
                    {
                        _id
                    }
                }
            );
            if (response.data._id === _id)
            {
                window.alert("Sua conta foi excluída.");
                setCurrentCentral ({});
            }
        }
    }

    return (
        <div className = "centralMenuArea">
            <form>
                <div className = "inputGroup">
                    <label>Nome</label>
                    <input
                    className = "nameInput"
                    placeholder = "Nome"
                    onChange = {(e) => {handleNameChange (e)}}
                    value = {newCentral.name}
                    pattern = "/[A-Za-z0-9_]{3,}/"
                    required
                    />
                </div>
                <div className = "inputGroup">
                    <label>E-mail</label>
                    <input
                    className = "emailInput"
                    placeholder = "E-mail"
                    onChange = {(e) => {handleEmailChange (e)}}
                    value = {newCentral.email}
                    type = "email"
                    required
                    />
                </div>
                <div className = "inputGroup inputGroupPassword">
                    <label>Senha</label>
                    <input
                    className = "registerInput registerPasswordInput"
                    placeholder = "Senha"
                    onChange = {(e) => {handlePasswordChange (e)}}
                    value = {newCentral.password}
                    type = {show ? "text" : "password"}
                    pattern = "/{3,}/"
                    required
                    />
                    <button
                    className = "buttonShow"
                    onMouseDown = {() => {setShow (true)}}
                    onMouseUp = {() => {setShow (false)}}
                    >
                        Mostrar
                    </button>
                </div>
                <div className = "buttonsMain">
                    <button
                    className = "buttonSubmit"
                    type = "submit"
                    onClick = {(e) => handleSubmit (e)}
                    >
                        Salvar
                    </button>
                    <Link to = "/login">
                        <button
                        className = "buttonDelete"
                        type = "button"
                        onClick = {(e) => handleDelete (e)}
                        >
                            Excluir conta
                        </button>
                    </Link>
                </div>
            </form>
            <div className = "space"/>
        </div>
    )
}

export default CentralMenu;
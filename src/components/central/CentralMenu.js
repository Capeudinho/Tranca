import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Redirect} from "react-router-dom";

import currentCentralContext from "../context/currentCentralContext";
import messageContext from "../context/messageContext";

import "../../css/central/centralMenu.css";

function CentralMenu ()
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {message, setMessage} = useContext (messageContext);
    const [show, setShow] = useState (false);
    const [newCentral, setNewCentral] = useState
    (
        {
            name: "",
            email: "",
            password: ""
        }
    );
    const [redirect, setRedirect] = useState (<div/>);
    const [confirm, setConfirm] = useState (false);
    const [validName, setValidName] = useState (true);
    const [validEmail, setValidEmail] = useState (true);
    const [validPassword, setValidPassword] = useState (true);

    useEffect
    (
        () =>
        {
            setNewCentral (currentCentral);
        },
        []
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

    function checkPassword (password)
    {
        if (password.length > 0)
        {
            setValidPassword (true);
            return true;
        }
        setValidPassword (false);
        return false;
    }

    function handleChangeName (e)
    {
        var tempCentral = Object.assign ({}, newCentral);
        tempCentral.name = e.target.value;
        checkName (e.target.value);
        setNewCentral (tempCentral);
    }

    function handleChangeEmail (e)
    {
        var tempCentral = Object.assign ({}, newCentral);
        tempCentral.email = e.target.value;
        checkEmail (e.target.value);
        setNewCentral (tempCentral);
    }

    function handleChangePassword (e)
    {
        var tempCentral = Object.assign ({}, newCentral);
        tempCentral.password = e.target.value;
        checkPassword (e.target.value);
        setNewCentral (tempCentral);
    }

    async function handleSubmit (e)
    {
        e.preventDefault ();
        if (checkName (newCentral.name) && checkEmail (newCentral.email) && checkPassword (newCentral.password))
        {
            const response = await api.put
            (
                "/centralidupdate",
                {
                    name: newCentral.name,
                    email: newCentral.email,
                    password: newCentral.password
                },
                {
                    params:
                    {
                        _id:newCentral._id
                    }
                }
            );
            if (response.data === "")
            {
                setMessage ("Já existe uma conta com esse e-mail.")
            }
            else
            {
                setCurrentCentral (response.data);
                setMessage ("Sua conta foi atualizada.");
            }
        }
        else
        {
            setMessage ("Um ou mais campos são inválidos.");
        }
    }

    async function handleDelete ()
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
            setRedirect (<Redirect to = "/login"/>);
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
                    value = {newCentral.name}
                    style = {{borderColor: validName ? "#cccccc" : "#cc5151"}}
                    onChange = {(e) => {handleChangeName (e)}}
                    />
                </div>
                <div className = "inputGroup">
                    <label>E-mail</label>
                    <input
                    className = "emailInput"
                    placeholder = "E-mail"
                    value = {newCentral.email}
                    style = {{borderColor: validEmail ? "#cccccc" : "#cc5151"}}
                    onChange = {(e) => {handleChangeEmail (e)}}
                    />
                </div>
                <div className = "inputGroup inputGroupPassword">
                    <label>Senha</label>
                    <input
                    className = "registerInput registerPasswordInput"
                    placeholder = "Senha"
                    value = {newCentral.password}
                    style = {{borderColor: validPassword ? "#cccccc" : "#cc5151"}}
                    onChange = {(e) => {handleChangePassword (e)}}
                    type = {show ? "text" : "password"}
                    />
                    <button
                    className = "buttonShow"
                    type = "button"
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
                    onClick = {(e) => {handleSubmit (e)}}
                    >
                        Salvar
                    </button>
                    <button
                    className = "buttonDelete"
                    type = "button"
                    onClick =
                    {
                        () =>
                        {
                            if (confirm)
                            {
                                handleDelete ();
                            }
                            else
                            {
                                setConfirm (true);
                            }
                        }
                    }
                    >
                        {confirm ? "Confirmar exclusão" : "Excluir"}
                    </button>
                </div>
            </form>
            
            {redirect}
        </div>
    )
}

export default CentralMenu;
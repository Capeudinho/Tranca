import React, {useState, useContext} from "react";
import api from "../../services/api";
import {Link, Redirect} from "react-router-dom";

import currentCentralContext from "../context/currentCentralContext";

import "../../css/central/centralLogin.css";

function CentralLogin ({match})
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const [registerName, setRegisterName] = useState ("");
    const [registerEmail, setRegisterEmail] = useState ("");
    const [registerPassword, setRegisterPassword] = useState ("");
    const [loginEmail, setLoginEmail] = useState ("");
    const [loginPassword, setLoginPassword] = useState ("");
    const [message, setMessage] = useState (false);
    const [goBack, setGoBack] = useState (false);
    const [registerShow, setRegisterShow] = useState (false);
    const [loginShow, setLoginShow] = useState (false);

    function handleRegisterNameChange (e)
    {
        const value = e.target.value;
        setRegisterName (value);
    }

    function handleRegisterEmailChange (e)
    {
        const value = e.target.value;
        setRegisterEmail (value);
    }

    function handleRegisterPasswordChange (e)
    {
        const value = e.target.value;
        setRegisterPassword (value);
    }

    function handleLoginEmailChange (e)
    {
        const value = e.target.value;
        setLoginEmail (value);
    }

    function handleLoginPasswordChange (e)
    {
        const value = e.target.value;
        setLoginPassword (value);
    }

    async function handleRegister (e)
    {
        e.preventDefault ();
        const name = registerName;
        const email = registerEmail;
        const password = registerPassword;
        const response = await api.post
        (
            "/centralstore",
            {
                name,
                email,
                password
            }
        );
        if (response.data === "")
        {
            window.alert ("Já existe uma conta com esse e-mail.");
        }
        else
        {
            await api.post
            (
                "/groupstore",
                {
                    name: "Raiz",
                    owner: response.data._id
                }
            );
            window.alert ("Sua conta foi criada.");
            setCurrentCentral (response.data);
            setGoBack (true);
        }
    }

    async function handleLogin (e)
    {
        e.preventDefault ();
        const email = loginEmail;
        const password = loginPassword;
        const response = await api.get
        (
            "/centralloginindex",
            {
                params:
                {
                    email,
                    password
                }
            }
        );
        if (response.data === null)
        {
            setMessage (true);
        }
        else
        {
            setMessage (false);
            setCurrentCentral (response.data);
            setGoBack (true);
        }
    }

    function GoBack ()
    {
        if (goBack === true)
        {
            return <Redirect to = ""/>
        }
        else
        {
            return <div/>
        }
    }

    function Semispace ()
    {
        if (message === true)
        {
            return (
                <div className = "semispace">
                    E-mail ou senha está incorreto
                </div>
            )
        }
        else
        {
            return <div className = "semispace"/>
        }
    }

    return (
        <>
            <GoBack/>
            <div className = "centralLoginArea">
                <div className = "space"/>
                <div className = "register">
                    <form>
                        <h1 className = "option">Registrar</h1>
                        <div className = "inputGroup">
                            <label>Nome</label>
                            <input
                            className = "registerInput registerNameInput"
                            placeholder = "Nome"
                            onChange = {(e) => {handleRegisterNameChange (e)}}
                            value = {registerName}
                            pattern = "/[A-Za-z0-9_]{3,}/"
                            required
                            />
                        </div>
                        <div className = "inputGroup">
                            <label>E-mail</label>
                            <input
                            className = "registerInput registerEmailInput"
                            placeholder = "E-mail"
                            onChange = {(e) => {handleRegisterEmailChange (e)}}
                            value = {registerEmail}
                            type = "email"
                            required
                            />
                        </div>
                        <div className = "inputGroup inputGroupPassword">
                            <label>Senha</label>
                            <input
                            className = "registerInput passwordInput"
                            placeholder = "Senha"
                            onChange = {(e) => {handleRegisterPasswordChange (e)}}
                            value = {registerPassword}
                            type = {registerShow ? "text" : "password"}
                            pattern = "/{3,}/"
                            required
                            />
                            <div className = "space"/>
                            <button
                            className = "buttonShow"
                            onMouseDown = {() => {setRegisterShow (true)}}
                            onMouseUp = {() => {setRegisterShow (false)}}
                            >
                                Mostrar
                            </button>
                        </div>
                        <Link to = {match.url.replace ("/login", "")}>
                            <button
                            className = "buttonRegister"
                            type = "submit"
                            onClick = {(e) => handleRegister (e)}
                            >
                                Cadastrar
                            </button>
                        </Link>
                    </form>
                </div>
                <div className = "space"/>
                <div className = "login">
                    <form>
                        <h1 className = "option">Login</h1>
                        <div className = "inputGroup">
                            <label>E-mail</label>
                            <input
                            className = "loginInput loginEmailInput"
                            placeholder = "E-mail"
                            onChange = {(e) => {handleLoginEmailChange (e)}}
                            value = {loginEmail}
                            type = "email"
                            />
                        </div>
                        <div className = "inputGroup inputGroupPassword">
                            <label>Senha</label>
                            <input
                            className = "loginInput passwordInput"
                            placeholder = "Senha"
                            onChange = {(e) => {handleLoginPasswordChange (e)}}
                            value = {loginPassword}
                            type = {loginShow ? "text" : "password"}
                            />
                            <div className = "space"/>
                            <button
                            className = "buttonShow"
                            onMouseDown = {() => {setLoginShow (true)}}
                            onMouseUp = {() => {setLoginShow (false)}}
                            >
                                Mostrar
                            </button>
                        </div>
                        <Semispace/>
                        <Link to = {match.url.replace ("/login", "")}>
                            <button
                            className = "buttonLogin"
                            type = "submit"
                            onClick = {(e) => handleLogin (e)}
                            >
                                Login
                            </button>
                        </Link>
                    </form>
                </div>
                <div className = "space"/>
            </div>
        </>
    )
}

export default CentralLogin;
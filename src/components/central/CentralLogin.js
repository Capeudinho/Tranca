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
    const [registerShow, setRegisterShow] = useState (false);
    const [loginShow, setLoginShow] = useState (false);
    const [registerMessage, setRegisterMessage] = useState ("");
    const [loginMessage, setLoginMessage] = useState ("");
    const [redirect, setRedirect] = useState (<div/>);
    const [validName, setValidName] = useState (true);
    const [validEmail, setValidEmail] = useState (true);
    const [validPassword, setValidPassword] = useState (true);
    const [loginSave, setLoginSave] = useState (false);
    const [registerSave, setRegisterSave] = useState (false);

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

    function handleRegisterChangeName (e)
    {
        const value = e.target.value;
        checkName (value);
        setRegisterName (value);
    }

    function handleRegisterChangeEmail (e)
    {
        const value = e.target.value;
        checkEmail (value);
        setRegisterEmail (value);
    }

    function handleRegisterChangePassword (e)
    {
        const value = e.target.value;
        checkPassword (value);
        setRegisterPassword (value);
    }

    function handleLoginChangeEmail (e)
    {
        const value = e.target.value;
        setLoginEmail (value);
    }

    function handleLoginChangePassword (e)
    {
        const value = e.target.value;
        setLoginPassword (value);
    }

    async function handleRegister (e)
    {
        e.preventDefault ();
        if (checkName (registerName) && checkEmail (registerEmail) && checkPassword (registerPassword))
        {
            const response = await api.post
            (
                "/centralstore",
                {
                    name: registerName,
                    email: registerEmail,
                    password: registerPassword
                }
            );
            if (response.data === "")
            {
                setRegisterMessage ("Já existe uma conta com esse e-mail.");
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
                if (registerSave)
                {
                    localStorage.setItem ("central", JSON.stringify (response.data));
                }
                setCurrentCentral (response.data);
                setRedirect (<Redirect to = "/"/>);
            }
        }
        else
        {
            setRegisterMessage ("Um ou mais campos são inválidos.")
        }
    }

    async function handleLogin (e)
    {
        e.preventDefault ();
        const response = await api.get
        (
            "/centralloginindex",
            {
                params:
                {
                    email: loginEmail,
                    password: loginPassword
                }
            }
        );
        if (response.data === null)
        {
            setLoginMessage ("E-mail ou senha está incorreto.");
        }
        else
        {
            if (loginSave)
            {
                localStorage.setItem ("central", JSON.stringify (response.data));
            }
            setCurrentCentral (response.data);
            setRedirect (<Redirect to = "/"/>);
        }
    }

    return (
        <div className = "centralLoginArea">
            <div className = "space"/>
            <div>
                <div className = "register">
                    {redirect}
                    <form>
                        <div className = "option">Registrar</div>
                        <div className = "inputGroup">
                            <label>Nome</label>
                            <input
                            className = "registerInput registerNameInput"
                            placeholder = "Nome"
                            value = {registerName}
                            style = {{borderColor: validName ? "#cccccc" : "#cc5151"}}
                            onChange = {(e) => {handleRegisterChangeName (e)}}
                            />
                        </div>
                        <div className = "inputGroup">
                            <label>E-mail</label>
                            <input
                            className = "registerInput registerEmailInput"
                            placeholder = "E-mail"
                            value = {registerEmail}
                            style = {{borderColor: validEmail ? "#cccccc" : "#cc5151"}}
                            onChange = {(e) => {handleRegisterChangeEmail (e)}}
                            />
                        </div>
                        <div className = "inputGroup inputGroupPassword">
                            <label>Senha</label>
                            <input
                            className = "registerInput passwordInput"
                            placeholder = "Senha"
                            value = {registerPassword}
                            style = {{borderColor: validPassword ? "#cccccc" : "#cc5151"}}
                            onChange = {(e) => {handleRegisterChangePassword (e)}}
                            type = {registerShow ? "text" : "password"}
                            />
                            <div className = "space"/>
                            <button
                            className = "buttonShow"
                            type = "button"
                            onMouseDown = {() => {setRegisterShow (true)}}
                            onMouseUp = {() => {setRegisterShow (false)}}
                            >
                                Mostrar
                            </button>
                        </div>
                        <div className = "save">
                            <label className = "labelSave">Guardar dados</label>
                            <div
                            className = "checkbox"
                            style = {{backgroundColor: registerSave ? "#cccccc" : "#ffffff"}}
                            onClick = {() => {setRegisterSave (!registerSave)}}
                            />
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
                <div className = "message">{registerMessage}</div>
            </div>
            <div className = "space"/>
            <div>
                <div className = "login">
                    <form>
                        <div className = "option">Login</div>
                        <div className = "inputGroup">
                            <label>E-mail</label>
                            <input
                            className = "loginInput loginEmailInput"
                            placeholder = "E-mail"
                            onChange = {(e) => {handleLoginChangeEmail (e)}}
                            value = {loginEmail}
                            />
                        </div>
                        <div className = "inputGroup inputGroupPassword">
                            <label>Senha</label>
                            <input
                            className = "loginInput passwordInput"
                            placeholder = "Senha"
                            onChange = {(e) => {handleLoginChangePassword (e)}}
                            value = {loginPassword}
                            type = {loginShow ? "text" : "password"}
                            />
                            <div className = "space"/>
                            <button
                            className = "buttonShow"
                            type = "button"
                            onMouseDown = {() => {setLoginShow (true)}}
                            onMouseUp = {() => {setLoginShow (false)}}
                            >
                                Mostrar
                            </button>
                        </div>
                        <div className = "save">
                            <label className = "labelSave">Guardar dados</label>
                            <div
                            className = "checkbox"
                            style = {{backgroundColor: loginSave ? "#cccccc" : "#ffffff"}}
                            onClick = {() => {setLoginSave (!loginSave)}}
                            />
                        </div>
                        <div className = "semispace"></div>
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
                <div className = "message">{loginMessage}</div>
            </div>
            <div className = "space"/>
        </div>
    );
}

export default CentralLogin;
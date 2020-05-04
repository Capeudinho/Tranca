import React, {useState} from "react";
import api from "../../services/api";

import "../../css/user/userAdd.css";

function UserAdd ()
{
    const [name, setName] = useState ("");
    const [email, setEmail] = useState ("");
    const [MACs, setMACs] = useState ([]);

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

    async function handleSubmit (e)
    {
        try
        {
            e.preventDefault ();
            const response = await api.post
            (
                "/userstore",
                {
                    name,
                    email,
                    MACs
                }
            );
            if (response.data === "")
            {
                window.alert("Já existe um usuário com esse nome.")
            }
            else
            {
                window.alert(`O usuário ${name} foi criado.`)
                document.getElementById ("userAdd").reset();
            }
        }
        catch (error)
        {
            throw new Error(error);
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
                        pattern = "[A-Za-z0-9_]{3,} "
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
                <div className = "buttonsMain">
                    <button
                    className = "buttonMACAdd"
                    type = "button"
                    onClick = {() => handleAddMAC ()}
                    >
                        Adicionar MAC
                    </button>
                    <button
                    className = "buttonSubmit"
                    type = "submit"
                    onClick = {(e) => handleSubmit (e)}
                    >
                        Criar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserAdd;
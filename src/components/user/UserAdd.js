import React, {useState} from "react";
import api from "../../services/api";

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
                "/users",
                {
                    name,
                    email,
                    MACs
                }
            );
            if (response.data === "")
            {
                window.alert("Já existe um usuário com esse nome")
            }
            else
            {
                window.alert(`Usuário ${name} foi criado.`)
                document.getElementById ("userAdd").reset();
            }
        }
        catch (error)
        {
            console.log (error);
        }
    }

    return (
        <form id = "userAdd">
            <div className = "inputBlockName">
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
                <label htmlFor = "name">E-mail</label>
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
                            <div key = {index}>
                                <input
                                    form = "userAdd"
                                    className = "MACInput"
                                    value = {MAC}
                                    placeholder = "MAC"
                                    onChange = {(e) => handleChangeMAC (index, e)}
                                />
                                <button
                                className = "MACRemove"
                                type = "button"
                                onClick = {() => handleRemoveMAC (index)}
                                >
                                    Remover
                                </button>
                            </div>
                        );
                    }
                )
            }
            <button
            className = "MACAdd"
            type = "button"
            onClick = {() => {handleAddMAC ()}}
            >
                Adicionar MAC
            </button>
            <button
            className = "formSubmit"
            type = "submit"
            onClick = {(e) => {handleSubmit (e)}}
            >
                Salvar
            </button>
        </form>
    )
}

export default UserAdd;
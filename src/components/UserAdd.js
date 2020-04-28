import React, { useState } from "react";
import api from "../services/api";

function UserAdd ()
{
    const [name, setName] = useState ("");
    const [MACs, setMACs] = useState ([]);

    function handleChangeName (e)
    {
        const value = e.target.value;
        setName (value);
    }

    function handleChangeMAC (index, e)
    {
        const values = [...MACs];
        values[index].value = e.target.value;
        setMACs (values);
    }

    function handleAddMAC ()
    {
        const values = [...MACs];
        values.push ({value: ""});
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
        e.preventDefault ();
        const response = await api.post
        (
            "/users",
            {
                name,
                MACs
            }
        );
        console.log (response.data)
    }

    return (
        <form>
            <div className = "input-block-name">
                <label htmlFor = "name">Nome</label>
                <input
                    placeholder = "Nome"
                    name = "name"
                    id = "name"
                    value = {name}
                    onChange = {(e) => handleChangeName (e)}
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
                                    value = {MAC.value}
                                    placeholder = "MAC"
                                    onChange = {(e) => handleChangeMAC (index, e)}
                                />
                                <button type = "button" onClick = {() => handleRemoveMAC (index)}>Remover</button>
                            </div>
                        );
                    }
                )
            }
            <button type = "button" onClick = {() => {handleAddMAC ()}}>Adicionar MAC</button>
            <button onClick = {(e) => {handleSubmit (e)}}>Salvar</button>
        </form>
    )
}

export default UserAdd;
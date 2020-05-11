import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import updatedGroupContext from "../context/updatedGroupContext";

import "../../css/group/groupEdit.css";

function UserEdit ({match})
{
    const {updatedGroup, setUpdatedGroup} = useContext (updatedGroupContext);
    const [group, setGroup] = useState ({name: ""});
    const [update, setUpdate] = useState (0);

    useEffect
    (
        () =>
        {
            const runEffect = async () =>
            {
                const _id = match.params.id;
                const response = await api.get
                (
                    "/groupidindex",
                    {
                        params:
                        {
                            _id
                        }
                    }
                )
                if (response.data !== null)
                {
                    setGroup (response.data);
                }
                else
                {
                    setUpdate (update+1);
                }
            }
            runEffect();
        },
        [update]
    )

    function handleChangeName (e)
    {
        var newGroup = Object.assign ({}, group);
        newGroup.name = e.target.value;
        setGroup (newGroup);
    }

    async function handleSubmit (e)
    {
        try
        {
            e.preventDefault ();
            const _id = group._id;
            const name = group.name;
            const response = await api.put
            (
                "/groupidupdatesimp",
                {
                    name
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
                window.alert(`O grupo ${group.name} foi atualizado.`);
                setUpdatedGroup (group);
            }
        }
        catch (error)
        {
            throw new Error(error);
        }
    }

    return (
        <div className = "groupEditArea">
            <form id = "groupEdit">
                <div className = "nameInputGroup">
                    <label htmlFor = "name">Nome</label>
                    <input
                        form = "groupEdit"
                        placeholder = "Nome"
                        className = "nameInput"
                        value = {group.name || ""}
                        onChange = {(e) => handleChangeName (e)}
                        pattern = "[A-Za-z0-9_]{3,} "
                        required
                    />
                </div>
                <Link to = {match.url.replace ("edit", "")}>
                    <button
                    className = "buttonSubmit"
                    type = "submit"
                    onClick = {(e) => handleSubmit (e)}
                    >
                        Salvar
                    </button>
                </Link>
            </form>
        </div>
    )
}

export default UserEdit;
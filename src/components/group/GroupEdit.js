import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import currentCentralContext from "../context/currentCentralContext";
import allRolesContext from "../context/allRolesContext";
import updatedGroupContext from "../context/updatedGroupContext";
import updatedLockContext from "../context/updatedLockContext";
import messageContext from "../context/messageContext";

import "../../css/group/groupEdit.css";

function GroupEdit ({match})
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {allRoles, setAllRoles} = useContext (allRolesContext);
    const {updatedGroup, setUpdatedGroup} = useContext (updatedGroupContext);
    const {updatedLock, setUpdatedLock} = useContext (updatedLockContext);
    const {message, setMessage} = useContext (messageContext);
    const [group, setGroup] = useState
    (
        {
            name: "",
            roles: []
        }
    );
    const [roles, setRoles] = useState ([]);
    const [validName, setValidName] = useState (true);

    useEffect
    (
        () =>
        {
            let mounted = true;
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
                );
                if (mounted)
                {
                    if (response.data.hasOwnProperty ("content"))
                    {
                        for (var k = 0; k < response.data.roles.length; k++)
                        {
                            for (var j = 0; j < allRoles.length; j++)
                            {
                                if (response.data.roles[k] === allRoles[j]._id)
                                {
                                    var tempRoles = roles;
                                    tempRoles.push (allRoles[j]);
                                    setRoles (tempRoles);
                                }
                            }
                        }
                    }
                    setGroup (response.data);
                }
            }
            runEffect();
            return (() => {mounted = false;});
        },
        [match.params.id]
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

    function handleChangeName (e)
    {
        var newGroup = Object.assign ({}, group);
        newGroup.name = e.target.value;
        checkName (e.target.value);
        setGroup (newGroup);
    }

    function handleChangeRole (index, e)
    {
        const values = [...group.roles];
        values[index] = e.target.options[e.target.selectedIndex].id;
        var newGroup = Object.assign ({}, group);
        newGroup.roles = values;
        setGroup (newGroup);
        const newRoles = roles;
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
            const values = [...group.roles];
            values.push (allRoles[0]);
            var newGroup = Object.assign ({}, group);
            newGroup.roles = values;
            setGroup (newGroup);
            const newRoles = roles;
            newRoles.push (allRoles[0]);
            setRoles (newRoles);
        }
    }

    function handleRemoveRole (index)
    {
        const values = [...group.roles];
        values.splice (index, 1);
        var newGroup = Object.assign ({}, group);
        newGroup.roles = values;
        setGroup (newGroup);
        const newRoles = roles;
        newRoles.splice (index, 1);
        setRoles (newRoles);
    }

    async function handleSubmit (e)
    {
        e.preventDefault ();
        if (checkName (group.name))
        {
            if (group.hasOwnProperty ("content"))
            {
                const response = await api.put
                (
                    "/groupidupdatesimp",
                    {
                        name: group.name,
                        roles: group.roles,
                        owner: currentCentral._id
                    },
                    {
                        params:
                        {
                            _id: group._id
                        }
                    }
                );
                if (response.data === "")
                {
                    setMessage (`Já existe um grupo com o nome ${group.name}.`);
                }
                else
                {
                    setUpdatedGroup (group);
                    setMessage (`O grupo ${group.name} foi atualizado.`);
                }
            }
            else
            {
                const _id = group._id;
                const name = group.name;
                const owner = currentCentral._id;
                const response = await api.put
                (
                    "/lockidupdatesimp",
                    {
                        name,
                        owner
                    },
                    {
                        params:
                        {
                            _id
                        }
                    }
                );
                if (response.data === "")
                {
                    setMessage (`Já existe uma tranca com o nome ${group.name}.`);
                }
                else
                {
                    setUpdatedLock (group);
                    setMessage (`A tranca ${group.name} foi atualizada.`);
                }
            }
        }
        else
        {

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
                        value = {group.name}
                        style = {{borderColor: validName ? "#cccccc" : "#cc5151"}}
                        onChange = {(e) => {handleChangeName (e)}}
                    />
                </div>
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
                                    onClick = {() => handleRemoveRole (index)}
                                    >
                                        X
                                    </button>
                                </div>
                            );
                        }
                    )
                }
                <button
                className = "buttonRoleAdd"
                type = "button"
                style = {{display: group.hasOwnProperty ("content") ? "block" : "none"}}
                onClick = {() => {handleAddRole ()}}
                >
                    Adicionar papel
                </button>
                <Link to = {match.url.replace ("edit", "")}>
                    <button
                    className = "buttonSubmit"
                    type = "submit"
                    onClick = {(e) => {handleSubmit (e)}}
                    >
                        Salvar
                    </button>
                </Link>
            </form>
        </div>
    )
}

export default GroupEdit;
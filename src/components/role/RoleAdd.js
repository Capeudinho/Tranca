import React, {useState, useContext} from "react";
import api from "../../services/api";

import allRolesContext from "../context/allRolesContext";
import addedRoleContext from "../context/addedRoleContext";

import "../../css/role/roleAdd.css";

function RoleAdd ()
{
    const {allRoles, setAllRoles} = useContext (allRolesContext);
    const {addedRole, setAddedRole} = useContext (addedRoleContext);
    const [name, setName] = useState ("");
    const [roleTimes, setRoleTimes] = useState ([]);

    function separate (values)
    {
        values.map
        (
            (value, index) =>
            {
                if (typeof (value.start) == "string")
                {
                    var a = value.start.match(/\d+/g).map(Number);
                    values[index].start = (a[0]*60)+a[1];
                    var b = value.end.match(/\d+/g).map(Number);
                    values[index].end = (b[0]*60)+b[1];
                }
            } 
        );
        return values;
    }

    function handleChangeName (e)
    {
        const value = e.target.value;
        setName (value);
    }

    function handleChangeStart (index, e)
    {
        const values = [...roleTimes];
        values[index].start = e.target.value;
        setRoleTimes (values);
    }

    function handleChangeEnd (index, e)
    {
        const values = [...roleTimes];
        values[index].end = e.target.value;
        setRoleTimes (values);
    }

    function handleChangeDay (index, e)
    {
        const values = [...roleTimes];
        values[index].day = e.target.options[e.target.selectedIndex].value;
        setRoleTimes (values);
    }

    function handleAddTime ()
    {
        const values = [...roleTimes];
        values.push ({start: 0, end: 0, day: 0});
        setRoleTimes (values);
    }

    function handleRemoveTime (index)
    {
        const values = [...roleTimes];
        values.splice (index, 1);
        setRoleTimes (values);
    }

    async function handleSubmit (e)
    {
        e.preventDefault ();
        const times = separate (roleTimes);
        const response = await api.post
        (
            "/rolestore",
            {
                name,
                times
            }
        );
        if (response.data === "")
        {
            window.alert ("Já existe uma função com esse nome.");
        }
        else
        {
            var newRoles = allRoles;
            newRoles.unshift (response.data);
            setAllRoles (newRoles);
            window.alert (`A função ${name} foi criada.`);
            setAddedRole (response.data);
            document.getElementById ("roleAdd").reset();
        }
    }

    return (
        <div className = "roleAddArea">
            <form id = "roleAdd">
                <div className = "nameInputGroup">
                    <label htmlFor = "name">Nome</label>
                    <input
                        form = "userAdd"
                        placeholder = "Nome"
                        className = "nameInput"
                        value = {name}
                        onChange = {(e) => handleChangeName (e)}
                        pattern = "[A-Za-z0-9_]{3,}"
                        required
                    />
                </div>
                {
                    roleTimes.map
                    (
                        (roleTime, index) =>
                        {
                            return (
                                <div className = "singleTime" key = {[index, "a"]}>
                                    <div className = "hourInputGroup" key = {[index, "b"]}>
                                        <label htmlFor = "Time">Início</label>
                                        <input
                                            type = "time"
                                            form = "roleAdd"
                                            className = "TimeInput"
                                            value = {roleTime.start || ""}
                                            onChange = {(e) => handleChangeStart (index, e)}
                                        />
                                        <div className = "space"></div>
                                        <label htmlFor = "Time">Final</label>
                                        <input
                                            type = "time"
                                            form = "roleAdd"
                                            className = "TimeInput"
                                            value = {roleTime.end || ""}
                                            onChange = {(e) => handleChangeEnd (index, e)}
                                        />
                                    </div>
                                    <div className = "dayInputGroup" key = {index}>
                                        <label htmlFor = "Time">Dia {index+1}</label>
                                        <select
                                        className = "daySelect"
                                        value = {roleTime.day}
                                        onChange = {(e) => handleChangeDay (index, e)}
                                        >
                                            <option key = {[index, 0]} value = {0}>Dias úteis</option>
                                            <option key = {[index, 1]} value = {1}>Domingo</option>
                                            <option key = {[index, 2]} value = {2}>Segunda</option>
                                            <option key = {[index, 3]} value = {3}>Terça</option>
                                            <option key = {[index, 4]} value = {4}>Quarta</option>
                                            <option key = {[index, 5]} value = {5}>Quinta</option>
                                            <option key = {[index, 6]} value = {6}>Sexta</option>
                                            <option key = {[index, 7]} value = {7}>Sábado</option>
                                        </select>
                                        <button
                                        className = "buttonTimeRemove"
                                        type = "button"
                                        onClick = {() => handleRemoveTime (index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                    )
                }
                <button
                className = "buttonTimeAdd"
                type = "button"
                onClick = {() => handleAddTime ()}
                >
                    Adicionar horário
                </button>
                <button
                className = "buttonSubmit"
                type = "submit"
                onClick = {(e) => handleSubmit (e)}
                >
                    Criar função
                </button>
            </form>
        </div>
    )
}

export default RoleAdd;
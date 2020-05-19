import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import updatedRoleContext from "../context/updatedRoleContext";

import "../../css/role/roleEdit.css";

function RoleEdit ({match})
{
    const {updatedRole, setUpdatedRole} = useContext (updatedRoleContext);
    const [role, setRole] = useState ({});
    const [update, setUpdate] = useState (0);

    useEffect
    (
        () =>
        {
            const runEffect = async () =>
            {
                const _id = match.params.id;
                var response = await api.get
                (
                    "/roleidindex",
                    {
                        params:
                        {
                            _id
                        }
                    }
                )
                response.data.times.map
                (
                    (time, index) =>
                    {
                        response.data.times[index].start = unite (time.start);
                        response.data.times[index].end = unite (time.end);
                    }
                )
                setRole (response.data);
                setUpdate (update+1);
            }
            runEffect();
        },
        [match.params.id]
    )

    function unite (value)
    {
        var a = 0;
        var b = 0;
        for (var k = true; k == true;)
        {
            if (value-60 >= 0)
            {
                b++;
                value = value-60;
            }
            else
            {
                a = value;
                k = false;
            }
        }
        a = a.toString ();
        b = b.toString ();
        if (a.length === 1)
        {
            a = "0"+a;
        }
        if (b.length === 1)
        {
            b = "0"+b;
        }
        return b+":"+a;
    }

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
        var newRole = Object.assign ({}, role);
        newRole.name = e.target.value;
        setRole (newRole);
    }

    function handleChangeStart (index, e)
    {
        const values = [...role.times];
        values[index].start = e.target.value;
        var newRole = Object.assign ({}, role);
        newRole.times = values;
        setRole (newRole);
    }

    function handleChangeEnd (index, e)
    {
        const values = [...role.times];
        values[index].end = e.target.value;
        var newRole = Object.assign ({}, role);
        newRole.times = values;
        setRole (newRole);
    }

    function handleChangeDay (index, e)
    {
        const values = [...role.times];
        values[index].day = e.target.options[e.target.selectedIndex].value;
        var newRole = Object.assign ({}, role);
        newRole.times = values;
        setRole (newRole);
    }

    function handleAddTime ()
    {
        const values = [...role.times];
        values.push ({start: 0, end: 0, day: 0});
        var newRole = Object.assign ({}, role);
        newRole.times = values;
        setRole (newRole);
    }

    function handleRemoveTime (index)
    {
        const values = [...role.times];
        values.splice (index, 1);
        var newRole = Object.assign ({}, role);
        newRole.times = values;
        setRole (newRole);
    }

    async function handleSubmit (e)
    {
        try
        {
            e.preventDefault ();
            const _id = role._id;
            const name = role.name;
            const times = separate (role.times);
            const response = await api.put
            (
                "/roleidupdate",
                {
                    name,
                    times
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
                window.alert(`A função ${role.name} foi atualizada.`);
                setUpdatedRole (role);
            }
        }
        catch (error)
        {
            throw new Error(error);
        }
    }

    function Times ()
    {
        if (role !== null && role !== undefined && role.hasOwnProperty ("times"))
        {
            return (
                <div>
                {
                    role.times.map
                    (
                        (time, index) =>
                        {
                            return (
                                <div className = "singleTime" key = {[index, "a"]}>
                                    <div className = "hourInputGroup" key = {[index, "b"]}>
                                        <label htmlFor = "Time">Início</label>
                                        <input
                                            type = "time"
                                            form = "roleEdit"
                                            className = "TimeInput"
                                            value = {time.start || ""}
                                            onChange = {(e) => handleChangeStart (index, e)}
                                        />
                                        <div className = "space"></div>
                                        <label htmlFor = "Time">Final</label>
                                        <input
                                            type = "time"
                                            form = "roleEdit"
                                            className = "TimeInput"
                                            value = {time.end || ""}
                                            onChange = {(e) => handleChangeEnd (index, e)}
                                        />
                                    </div>
                                    <div className = "dayInputGroup" key = {index}>
                                        <label htmlFor = "Time">Dia {index+1}</label>
                                        <select
                                        className = "daySelect"
                                        value = {time.day}
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
                </div>
            )
        }
        else
        {
            return <div/>
        }
    }

    return (
        <div className = "roleEditArea">
            <form id = "roleEdit">
                <div className = "nameInputGroup">
                    <label htmlFor = "name">Nome</label>
                    <input
                        form = "roleEdit"
                        placeholder = "Nome"
                        className = "nameInput"
                        value = {role.name || ""}
                        onChange = {(e) => handleChangeName (e)}
                        pattern = "[A-Za-z0-9_]{3,} "
                        required
                    />
                </div>
                <Times/>
                <button
                className = "buttonTimeAdd"
                type = "button"
                onClick = {() => handleAddTime ()}
                >
                    Adicionar horário
                </button>
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

export default RoleEdit;
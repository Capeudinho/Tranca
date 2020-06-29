import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import currentCentralContext from "../context/currentCentralContext";
import updatedRoleContext from "../context/updatedRoleContext";

import "../../css/role/roleEdit.css";

function RoleEdit ({match})
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {updatedRole, setUpdatedRole} = useContext (updatedRoleContext);
    const [role, setRole] = useState ({});
    const [update, setUpdate] = useState (0);

    useEffect
    (
        () =>
        {
            let mounted = true;
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
                if (mounted)
                {
                    setRole (response.data);
                    setUpdate (update+1);
                }
            }
            runEffect();
            return (() => {mounted = false;});
        },
        [match.params.id]
    )

    function unite (value)
    {
        var a = 0;
        var b = 0;
        for (var k = true; k === true;)
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
                if (typeof (value.start) === "string")
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

    function handleChangeDay (index, value)
    {
        const values = [...role.times];
        if (values[index].day[value] === true)
        {
            values[index].day[value] = false;
        }
        else
        {
            values[index].day[value] = true;
        }
        var newRole = Object.assign ({}, role);
        newRole.times = values;
        setRole (newRole);
    }

    function handleChangeTrack (index)
    {
        const values = [...role.times];
        if (values[index].options.track === true)
        {
            values[index].options.track = false;
        }
        else
        {
            values[index].options.track = true;
        }
        var newRole = Object.assign ({}, role);
        newRole.times = values;
        setRole (newRole);
    }

    function handleChangeDirect (index)
    {
        const values = [...role.times];
        if (values[index].options.direct === true)
        {
            values[index].options.direct = false;
        }
        else
        {
            values[index].options.direct = true;
        }
        var newRole = Object.assign ({}, role);
        newRole.times = values;
        setRole (newRole);
    }

    function handleAddTime ()
    {
        const values = [...role.times];
        values.push
        (
            {
                start: 0,
                end: 0,
                day: [false, false, false, false, false, false, false],
                options:
                {
                    track: false,
                    direct: false
                }
            }
        );
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
            const owner = currentCentral._id;
            const response = await api.put
            (
                "/roleidupdate",
                {
                    name,
                    times,
                    owner
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
                window.alert (`O papel ${role.name} foi atualizado.`);
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
                                    <div className = "dayInputGroup" key = {index, "c"}>
                                        <label htmlFor = "Time">Dia {index+1}</label>
                                        <div className = "singleDay" key = {[index, 0]}>
                                            <label htmlFor = "Time">D</label>
                                            <div
                                            className = "checkbox"
                                            style = {{backgroundColor: time.day[0] ? "#cccccc" : "#ffffff"}}
                                            onClick = {() => handleChangeDay (index, 0)}
                                            />
                                        </div>
                                        <div className = "singleDay" key = {[index, 1]}>
                                            <label htmlFor = "Time">S</label>
                                            <div
                                            className = "checkbox"
                                            style = {{backgroundColor: time.day[1] ? "#cccccc" : "#ffffff"}}
                                            onClick = {() => handleChangeDay (index, 1)}
                                            />
                                        </div>
                                        <div className = "singleDay" key = {[index, 2]}>
                                            <label htmlFor = "Time">T</label>
                                            <div
                                            className = "checkbox"
                                            style = {{backgroundColor: time.day[2] ? "#cccccc" : "#ffffff"}}
                                            onClick = {() => handleChangeDay (index, 2)}
                                            />
                                        </div>
                                        <div className = "singleDay" key = {[index, 3]}>
                                            <label htmlFor = "Time">Q</label>
                                            <div
                                            className = "checkbox"
                                            style = {{backgroundColor: time.day[3] ? "#cccccc" : "#ffffff"}}
                                            onClick = {() => handleChangeDay (index, 3)}
                                            />
                                        </div>
                                        <div className = "singleDay" key = {[index, 4]}>
                                            <label htmlFor = "Time">Q</label>
                                            <div
                                            className = "checkbox"
                                            style = {{backgroundColor: time.day[4] ? "#cccccc" : "#ffffff"}}
                                            onClick = {() => handleChangeDay (index, 4)}
                                            />
                                        </div>
                                        <div className = "singleDay" key = {[index, 5]}>
                                            <label htmlFor = "Time">S</label>
                                            <div
                                            className = "checkbox"
                                            style = {{backgroundColor: time.day[5] ? "#cccccc" : "#ffffff"}}
                                            onClick = {() => handleChangeDay (index, 5)}
                                            />
                                        </div>
                                        <div className = "singleDay" key = {[index, 6]}>
                                            <label htmlFor = "Time">S</label>
                                            <div
                                            className = "checkbox"
                                            style = {{backgroundColor: time.day[6] ? "#cccccc" : "#ffffff"}}
                                            onClick = {() => handleChangeDay (index, 6)}
                                            />
                                        </div>
                                    </div>
                                    <div className = "optionInputGroup" key = {index, "d"}>
                                        <div className = "singleTrackOption" key = {[index, 7]}>
                                            <label htmlFor = "Time">Rastrear pulos</label>
                                            <div
                                            className = "checkbox"
                                            style = {{backgroundColor: time.options.track ? "#cccccc" : "#ffffff"}}
                                            onClick = {() => handleChangeTrack (index)}
                                            >
                                                <span className = "tooltiptext">Ao fim deste horário, para cada tranca afetada não acessada por cada usuário afetado, você será notificado.</span> 
                                            </div>
                                        </div>
                                        <div className = "singleDirectOption" key = {[index, 8]}>
                                            <label htmlFor = "Time">Obedecer proprietário</label>
                                            <div
                                            className = "checkbox"
                                            style = {{backgroundColor: time.options.direct ? "#cccccc" : "#ffffff"}}
                                            onClick = {() => handleChangeDirect (index)}
                                            >
                                                <span className = "tooltiptext">Este horário só afetará trancas diretamente pertencentes a grupos com este papel.</span>
                                            </div>
                                        </div>
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
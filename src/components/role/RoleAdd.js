import React, {useState, useContext} from "react";
import api from "../../services/api";

import currentCentralContext from "../context/currentCentralContext";
import allRolesContext from "../context/allRolesContext";
import addedRoleContext from "../context/addedRoleContext";

import "../../css/role/roleAdd.css";

function RoleAdd ()
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {allRoles, setAllRoles} = useContext (allRolesContext);
    const {addedRole, setAddedRole} = useContext (addedRoleContext);
    const [name, setName] = useState ("");
    const [times, setTimes] = useState ([]);

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
        const value = e.target.value;
        setName (value);
    }

    function handleChangeStart (index, e)
    {
        const values = [...times];
        values[index].start = e.target.value;
        setTimes (values);
    }

    function handleChangeEnd (index, e)
    {
        const values = [...times];
        values[index].end = e.target.value;
        setTimes (values);
    }

    function handleChangeDay (index, value)
    {
        const values = [...times];
        if (values[index].day[value] === true)
        {
            values[index].day[value] = false;
        }
        else
        {
            values[index].day[value] = true;
        }
        setTimes (values);
    }

    function handleChangeTrack (index)
    {
        const values = [...times];
        if (values[index].options.track === true)
        {
            values[index].options.track = false;
        }
        else
        {
            values[index].options.track = true;
        }
        setTimes (values);
    }

    function handleChangeDirect (index)
    {
        const values = [...times];
        if (values[index].options.direct === true)
        {
            values[index].options.direct = false;
        }
        else
        {
            values[index].options.direct = true;
        }
        setTimes (values);
    }

    function handleAddTime ()
    {
        const values = [...times];
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
        setTimes (values);
    }

    function handleRemoveTime (index)
    {
        const values = [...times];
        values.splice (index, 1);
        setTimes (values);
    }

    async function handleSubmit (e)
    {
        e.preventDefault ();
        const tempTimes = separate (times);
        const owner = currentCentral._id;
        const response = await api.post
        (
            "/rolestore",
            {
                name,
                times: tempTimes,
                owner
            }
        );
        if (response.data === "")
        {
            window.alert ("Já existe um papel com esse nome.");
        }
        else
        {
            var newRoles = allRoles;
            newRoles.unshift (response.data);
            setAllRoles (newRoles);
            window.alert (`O papel ${name} foi criado.`);
            setAddedRole (response.data);
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
                    times.map
                    (
                        (time, index) =>
                        {
                            return (
                                <div className = "singleTime" key = {[index, "a"]}>
                                    <div className = "hourInputGroup" key = {[index, "b"]}>
                                        <label htmlFor = "Time">Início</label>
                                        <input
                                            type = "time"
                                            form = "roleAdd"
                                            className = "TimeInput"
                                            value = {time.start || ""}
                                            onChange = {(e) => handleChangeStart (index, e)}
                                        />
                                        <div className = "space"></div>
                                        <label htmlFor = "Time">Final</label>
                                        <input
                                            type = "time"
                                            form = "roleAdd"
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
                    Criar papel
                </button>
            </form>
        </div>
    )
}

export default RoleAdd;
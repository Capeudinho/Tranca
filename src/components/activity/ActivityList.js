import React, {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import api from "../../services/api";
import io from "socket.io-client";

import currentCentralContext from "../context/currentCentralContext";
import allRolesContext from "../context/allRolesContext";

import "../../css/activity/activityList.css";

const socket = io ("http://localhost:3001", {transports: ["websocket", "polling"]});

function ActivityList ()
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {allRoles, setAllRoles} = useContext (allRolesContext);
    const [logs, setLogs] = useState ([]);
    const [page, setPage] = useState (1);
    const [pageLimit, setPageLimit] = useState (1);
    const [user, setUser] = useState ("");
    const [lock, setLock] = useState ("");
    const [role, setRole] = useState ("");
    const [type, setType] = useState ("");
    const [initialDate, setInitialDate] = useState ("");
    const [finalDate, setFinalDate] = useState ("");
    const [update, setUpdate] = useState (0);

    useEffect
    (
        () =>
        {
            let mounted = true;

            socket.on
            (
                "connect",
                () =>
                {
                    console.log ("Conectou");
                }
            );

            socket.on
            (
                "log",
                (log) =>
                {
                    if (log.owner === currentCentral._id)
                    {
                        var newLogs = logs;
                        newLogs.unshift (log);
                        if (mounted)
                        {
                            setLogs (newLogs);
                            setUpdate (update+1);
                        }
                        console.log ("Recebeu");
                    }
                }
            );
        },
        []
    );

    useEffect
    (
        () =>
        {
            let mounted = true;
            const runEffect = async () =>
            {
                const owner = currentCentral._id;
                const response = await api.get
                (
                    "/loglistpag",
                    {
                        params:
                        {
                            page,
                            user,
                            lock,
                            role,
                            type,
                            initialDate,
                            finalDate,
                            owner
                        }
                    }
                );
                if (mounted)
                {
                    setPageLimit (response.data.pages);
                    setLogs ([...logs, ...response.data.docs]);
                }
            }
            runEffect ();
            return (() => {mounted = false;});
        },
        [page, update]
    );

    function separate (date)
    {
        date = date.split (/-|T|:/);
        date = [...date, ...date [5].split (".")];
        date.splice (5, 1);
        date = date[2]+"/"+date[1]+" "+date[3]+":"+date[4];
        return date;
    }

    function handleChangeUser (e)
    {
        const value = e.target.value;
        setUser (value);
    }

    function handleChangeLock (e)
    {
        const value = e.target.value;
        setLock (value);
    }

    function handleChangeRole (e)
    {
        const value = e.target.options[e.target.selectedIndex].value;
        setRole (value);
        console.log (value);
    }

    function handleChangeType (e)
    {
        const value = e.target.options[e.target.selectedIndex].value;
        setType (value);
    }

    function handleChangeInitialDate (e)
    {
        const value = e.target.value;
        setInitialDate (value);
    }

    function handleChangeFinalDate (e)
    {
        const value = e.target.value;
        setFinalDate (value);
    }

    function handleCleanInitialDate ()
    {
        setInitialDate ("");
    }

    function handleCleanFinalDate ()
    {
        setFinalDate ("");
    }

    function handleSubmit (e)
    {
        e.preventDefault ();
        setPage (1);
        setLogs ([]);
        setUpdate (update+1);
    }
    
    return (
        <div className = "activityListArea">
            <div className = "searchBar"> 
                <div className = "firstRow">
                    <div className = "inputGroup">
                        <label>Usuário</label>
                        <input
                        value = {user}
                        onChange = {(e) => {handleChangeUser (e)}}
                        placeholder = "Usuário"
                        />
                    </div>
                    <div className = "inputGroup">
                        <label>Tranca</label>
                        <input
                        value = {lock}
                        onChange = {(e) => {handleChangeLock (e)}}
                        placeholder = "Tranca"
                        />
                    </div>
                </div>
                <div className = "secondRow">
                    <div className = "timeInputGroup">
                        <form>
                            <label>Data inicial</label>
                            <input
                            type = "date"
                            onChange = {(e) => {handleChangeInitialDate (e)}}
                            />
                            <button
                            className = "buttonClean"
                            onClick = {() => {handleCleanInitialDate ()}}
                            type = "reset"
                            >
                                Limpar
                            </button>
                        </form>
                    </div>
                    <div className = "timeInputGroup">
                        <form>
                            <label>Data final</label>
                            <input
                            type = "date"
                            onChange = {(e) => {handleChangeFinalDate (e)}}
                            />
                            <button
                            className = "buttonClean"
                            onClick = {() => {handleCleanFinalDate ()}}
                            type = "reset"
                            >
                                Limpar
                            </button>
                        </form>
                    </div>
                </div>
                <div className = "thirdRow">
                    <div className = "inputGroup">
                        <label>Papel</label>
                        <select
                        onChange = {(e) => {handleChangeRole (e)}}
                        disabled = {allRoles.length === 0 ? true : false}
                        >
                            <option value = "">Qualquer</option>
                            {
                                allRoles.map
                                (
                                    (role, index) =>
                                    {
                                        return (
                                            <option
                                            id = {role._id}
                                            key = {index}
                                            value = {role.name}
                                            >
                                                {role.name}
                                            </option>
                                        )
                                    }
                                )
                            }
                        </select>
                    </div>
                    <div className = "grouping">
                        <div className = "inputGroup">
                            <label>Tipo</label>
                            <select
                            onChange = {(e) => {handleChangeType (e)}}
                            >
                                <option value = "">Qualquer</option>
                                <option value = "normal">Normal</option>
                                <option value = "warning">Aviso</option>
                            </select>
                        </div>
                        <button className = "buttonSearch" onClick = {(e) => handleSubmit (e)}>Pesquisar</button>
                    </div>
                </div>
            </div>
            {
                logs.map
                (
                    (log, index) =>
                    {
                        return (
                            <div key = {index} className = "log">
                                <div
                                key = {[index, 1]}
                                className = {log.type === "normal" ? "time" : "time timewarning"}
                                >
                                    {separate (log.creationDate)}
                                </div>
                                <Link key = {index} to = {`/logs/${log._id}`}>
                                    <button
                                    key = {[index, 2]}
                                    className = {log.type === "normal" ? "info" : "info infowarning"}
                                    >
                                        {
                                            log.type === "normal" ?
                                            `O usuário ${log.user} abriu a fechadura ${log.lock}` :
                                            `O usuário ${log.user} deixou de abrir a fechadura ${log.lock}`
                                        }
                                    </button>
                                </Link>
                            </div>
                        )
                    }
                )
            }
            <button
            className = "buttonLoadMore"
            onClick = {() => {if (page < pageLimit) {setPage (page+1)}}}>
                Carregar mais
            </button>
        </div>
    )
}

export default ActivityList;
import React, {useState, useEffect} from "react";
import api from "../../services/api";

import "../../css/activity/activityInfo.css";

function LogInfo ({match})
{
    const [log, setLog] = useState
    (
        {
            roles: [],
            user: "",
            lock: "",
            holders: [],
            type: "normal",
            creationDate: ""
        }
    );
    const [update, setUpdate] = useState (0);

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
                    "/logidindex",
                    {
                        params:
                        {
                            _id
                        }
                    }
                );
                if (mounted)
                {
                    setLog (response.data);
                    setUpdate (update+1);
                }
            }
            runEffect();
            return (() => {mounted = false;});
        },
        [match]
    );

    function separate (date)
    {
        if (date === "") {return "";}
        date = date.split (/-|T|:/);
        date = [...date, ...date [5].split (".")];
        date.splice (5, 1);
        date = date[2]+"/"+date[1]+" "+date[3]+":"+date[4];
        return date;
    }

    return (
        <div className = "logInfoArea">
            <div className = "logType">
                {
                    log.type === "normal" ?
                    "Log de acesso" :
                    "Log de aviso"
                }
            </div>
            <div className = "logData">
                <div className = "left">
                    <div className = "title">Caminho</div>
                    {
                        log.holders.map
                        (
                            (holder, index) =>
                            {
                                return (<div className = "holder" key = {index}>{holder}</div>);
                            }
                        )
                    }
                    <div className = "text">{log.lock}</div>
                </div>
                <div className = "right">
                    <div className = "title">Data</div>
                    <div className = "inbetween">{separate (log.creationDate)}</div>
                    <div className = "title">Usuário</div>
                    <div className = "inbetween">{log.user}</div>
                    <div className = "title">Papéis</div>
                    {
                        log.roles.map
                        (
                            (role, index) =>
                            {
                                return (<div  className = "role" key = {index}>{role}</div>)
                            }
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default LogInfo
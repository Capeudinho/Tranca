import React, {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import io from "socket.io-client";

import currentCentralContext from "../context/currentCentralContext";

import "../../css/base/baseLeft.css";

const socket = io ("http://localhost:3001", {transports: ["websocket", "polling"]});

function BaseLeft ()
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const [normalEntry, setNormalEntry] = useState (0);
    const [warningEntry, setWarningEntry] = useState (0);

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
                    if (log.owner === currentCentral._id && mounted)
                    {
                        if (log.type === "normal")
                        {
                            setNormalEntry (normalEntry+1);
                        }
                        else
                        {
                            setWarningEntry (warningEntry+1);
                        }
                        console.log ("Recebeu");
                    }
                }
            );
        },
        []
    );

    return (
        <div className = "baseLeftArea">
            <div className = "area areaRecents">
                <Link to = "/">
                    <button className = "buttonList">Principal</button>
                </Link>
            </div>
            <div className = "area areaGroups">
                <Link to = "/groups">
                    <button className = "buttonList">Grupos</button>
                </Link>
            </div>
            <div className = "area areaUsers">
                <Link to = "/users">
                    <button className = "buttonList">Usuários</button>
                </Link>
            </div>
            <div className = "area areaRoles">
                <Link to = "/roles">
                    <button className = "buttonList">Papéis</button>
                </Link>
            </div>
            <div className = "area areaLog">
                <Link to = "/logs">
                    <button className = "buttonList buttonListOther">Log</button>
                </Link>
                <div className = "entry entryNormal">
                    {normalEntry}
                </div>
                <div className = "entry entryWarning">
                    {warningEntry}
                </div>
            </div>
            <div className = "area areaMenu">
                <Link to = "/menu">
                    <button className = "buttonList buttonListOther">Menu</button>
                </Link>
            </div>
        </div>
    )
}

export default BaseLeft;
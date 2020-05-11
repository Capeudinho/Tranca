import React, {useState} from "react";
import {BrowserRouter, Route} from "react-router-dom";

import groupPathContext from "../context/groupPathContext";

import "../../css/group/groupCenter.css";

import GroupExplorer from "./GroupExplorer";
import GroupList from "./GroupList";

function GroupCenter ()
{
    const [groupPath, setGroupPath] = useState ("");

    return (
        <BrowserRouter>
            <groupPathContext.Provider value = {{groupPath, setGroupPath}}>
                <div className = "groupCenterArea">
                    <Route path = "/groups" component = {GroupExplorer}/>
                    <Route path = "/groups/:id" component = {GroupList}/>
                </div>
            </groupPathContext.Provider>
        </BrowserRouter>
    )
}

export default GroupCenter;
import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import currentCentralContext from "../context/currentCentralContext";
import groupPathContext from "../context/groupPathContext";
import deletedGroupsContext from "../context/deletedGroupsContext";
import updatedGroupContext from "../context/updatedGroupContext";
import addedGroupContext from "../context/addedGroupContext";
import deletedLockContext from "../context/deletedLockContext";
import updatedLockContext from "../context/updatedLockContext";
import addedLockContext from "../context/addedLockContext";

import "../../css/group/groupExplorer.css";

function GroupExplorer (props)
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {groupPath, setGroupPath} = useContext (groupPathContext);
    const {deletedGroups, setDeletedGroups} = useContext (deletedGroupsContext);
    const {updatedGroup, setUpdatedGroup} = useContext (updatedGroupContext);
    const {addedGroup, setAddedGroup} = useContext (addedGroupContext);
    const {deletedLock, setDeletedLock} = useContext (deletedLockContext);
    const {updatedLock, setUpdatedLock} = useContext (updatedLockContext);
    const {addedLock, setAddedLock} = useContext (addedLockContext);
    const [groups, setGroups] = useState ([]);
    const [expandedGroups, setExpandedGroups] = useState ([]);
    const [update, setUpdate] = useState (0);

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
                    "/grouplevelindex",
                    {
                        params:
                        {
                            level: 0,
                            owner
                        }
                    }
                );
                if (mounted)
                {
                    setGroups (response.data);
                }
            }
            runEffect();
            return (() => {mounted = false;});
        },
        []
    )

    useEffect
    (
        () =>
        {
            if (deletedGroups.hasOwnProperty ("group"))
            {
                var newGroups = groups;
                for (var k = 0; k < newGroups.length; k++)
                {
                    var goBack = false;
                    if (newGroups[k]._id === deletedGroups.group._id)
                    {
                        newGroups.splice (k, 1);
                        goBack = true;
                    }
                    else if (newGroups[k]._id === deletedGroups.newContentGroup._id)
                    {
                        newGroups[k] = deletedGroups.newContentGroup;
                    }
                    for (var j = 0; j < deletedGroups.otherGroups.length; j++)
                    {
                        if (newGroups[k]._id === deletedGroups.otherGroups[j]._id)
                        {
                            newGroups.splice (k, 1);
                            goBack = true;
                        }
                    }
                    for (var i = 0; i < deletedGroups.otherLocks.length; i++)
                    {
                        if (newGroups[k]._id === deletedGroups.otherLocks[i]._id)
                        {
                            newGroups.splice (k, 1);
                            goBack = true;
                        }
                    }
                    if (goBack === true)
                    {
                        k--;
                    }
                }
                var newExpandedGroups = expandedGroups;
                for (var h = 0; h < expandedGroups.length; h++)
                {
                    var goBack = false;
                    if (newExpandedGroups[h]._id === deletedGroups.group._id)
                    {
                        newExpandedGroups.splice (h, 1);
                        goBack = true;
                    }
                    else if (newExpandedGroups[h]._id === deletedGroups.newContentGroup._id)
                    {
                        newExpandedGroups[h] = deletedGroups.newContentGroup;
                    }
                    for (var f = 0; f < deletedGroups.otherGroups.length; f++)
                    {
                        if (newExpandedGroups[h]._id === deletedGroups.otherGroups[f]._i)
                        {
                            newExpandedGroups.splice (h, 1);
                            goBack = true;
                        }
                    }
                    if (goBack === true)
                    {
                        h--;
                    }
                }
                setExpandedGroups (newExpandedGroups);
                setGroups (newGroups);
                setUpdate (update+1);
            }
        },
        [deletedGroups]
    )

    useEffect
    (
        () =>
        {
            if (updatedGroup.hasOwnProperty ("_id"))
            {
                groups.map
                (
                    (group, index) =>
                    {
                        if (group._id === updatedGroup._id)
                        {
                            var tempGroup = groups;
                            tempGroup[index] = updatedGroup;
                            setGroups (tempGroup);
                            setUpdate (update+1);
                        }
                    }
                )
            }
        },
        [updatedGroup]
    )

    useEffect
    (
        () =>
        {
            if (addedGroup.hasOwnProperty ("newGroup"))
            {
                var groupBoolean = false;
                var groupIndex = 0;
                groups.map
                (
                    (group, index) =>
                    {
                        if (group._id === addedGroup.newGroup.holder[addedGroup.newGroup.holder.length-1])
                        {
                            groupBoolean = true;
                            groupIndex = index;
                            var tempContentGroups = groups;
                            tempContentGroups[index] = addedGroup.newContentGroup;
                            setGroups (tempContentGroups);
                        }
                    }
                )
                var expandedGroupBoolean = false;
                expandedGroups.map
                (
                    (expandedGroup, index) =>
                    {
                        if (expandedGroup._id === addedGroup.newGroup.holder[addedGroup.newGroup.holder.length-1])
                        {
                            expandedGroupBoolean = true;
                            var tempContentExpandedGroups = expandedGroups;
                            tempContentExpandedGroups[index] = addedGroup.newContentGroup;
                            setExpandedGroups (tempContentExpandedGroups);
                        }
                    }
                )
            }
            if (groupBoolean === true && expandedGroupBoolean === true)
            {
                var tempGroups = groups;
                tempGroups.splice (groupIndex+1, 0, addedGroup.newGroup);
                setGroups (tempGroups);
                setUpdate (update+1);
            }
        },
        [addedGroup]
    )

    useEffect
    (
        () =>
        {
            if (deletedLock.hasOwnProperty ("lock"))
            {
                var newGroups = groups;
                for (var k = 0; k < newGroups.length; k++)
                {
                    if (newGroups[k]._id === deletedLock.lock._id)
                    {
                        newGroups.splice (k, 1);
                        k--;
                    }
                    else if (newGroups[k]._id === deletedLock.newContentGroup._id)
                    {
                        newGroups[k] = deletedLock.newContentGroup;
                    }
                }
                setGroups (newGroups);
                setUpdate (update+1);
            }
        },
        [deletedLock]
    )

    useEffect
    (
        () =>
        {
            if (updatedLock.hasOwnProperty ("_id"))
            {
                groups.map
                (
                    (group, index) =>
                    {
                        if (group._id === updatedLock._id)
                        {
                            var tempGroup = groups;
                            tempGroup[index] = updatedLock;
                            setGroups (tempGroup);
                            setUpdate (update+1);
                        }
                    }
                )
            }
        },
        [updatedLock]
    )

    useEffect
    (
        () =>
        {
            if (addedLock.hasOwnProperty ("newLock"))
            {
                var groupBoolean = false;
                var groupIndex = 0;
                groups.map
                (
                    (group, index) =>
                    {
                        if (group._id === addedLock.newLock.holder[addedLock.newLock.holder.length-1])
                        {
                            groupBoolean = true;
                            groupIndex = index;
                            var tempContentGroups = groups;
                            tempContentGroups[index] = addedLock.newContentGroup;
                            setGroups (tempContentGroups);
                        }
                    }
                )
                var expandedGroupBoolean = false;
                expandedGroups.map
                (
                    (expandedGroup, index) =>
                    {
                        if (expandedGroup._id === addedLock.newLock.holder[addedLock.newLock.holder.length-1])
                        {
                            expandedGroupBoolean = true;
                            var tempContentExpandedGroups = expandedGroups;
                            tempContentExpandedGroups[index] = addedLock.newContentGroup;
                            setExpandedGroups (tempContentExpandedGroups);
                        }
                    }
                )
            }
            if (groupBoolean === true && expandedGroupBoolean === true)
            {
                var tempGroups = groups;
                tempGroups.splice (groupIndex+1, 0, addedLock.newLock);
                setGroups (tempGroups);
                setUpdate (update+1);
            }
        },
        [addedLock]
    )

    function newUrl (_id)
    {
        var url = props.location.pathname;
        var arr = url.split ("/");
        arr[2] = _id;
        url = arr.join ("/");
        return url;
    }

    function handleGroupDoubleClick (index, group)
    {
        if (expandedGroups.includes (group))
        {
            handleContract (group);
        }
        else
        {
            handleExpand (index, group);
        }
    }

    async function handleExpand (index, group)
    {
        const tempExpandedGroups = expandedGroups;
        tempExpandedGroups.push (group);
        setExpandedGroups (tempExpandedGroups);
        const content = group.content;
        const response = await api.get
        (
            "/groupcontentindex",
            {
                params:
                {
                    content
                }
            }
        );
        var newGroups = groups;
        for (var k = response.data.length-1; k >= 0; k--)
        {
            newGroups.splice (index+1, 0, response.data[k])
        }
        setGroups (newGroups);
        setUpdate (update+1);
    }

    function handleContract (group)
    {
        var tempExpandedGroups = expandedGroups;
        tempExpandedGroups = tempExpandedGroups.filter
        (
            (filterGroup) =>
            {
                if (filterGroup === group || filterGroup.holder === group._id)
                {return false;}
                else {return true;}
            }
        );
        setExpandedGroups (tempExpandedGroups);
        var tempGroups = groups;
        tempGroups = tempGroups.filter
        (
            (filterGroup) =>
            {
                if (filterGroup.holder.includes (group._id))
                {return false;}
                else {return true;}
            }
        );
        setGroups (tempGroups);
        setUpdate (update+1);
    }

    function handleGroupClick (group)
    {
        setGroupPath ("");
        var path = "";
        groups.map
        (
            (singleGroup) =>
            {
                if (group.holder.includes (singleGroup._id) || group === singleGroup)
                {
                    if (path === "")
                    {
                        path = singleGroup.name;
                    }
                    else
                    {
                        path = path.concat (" > "+singleGroup.name);
                    }
                }
            }
        )
        setGroupPath (path);
    }

    return (
        <div className = "groupExplorerArea">
            {
                groups.map
                (
                    (group, index) =>
                    {
                        if (group.hasOwnProperty ("content"))
                        {
                            return (
                                <div key = {index} className = "groupGroup">
                                    <div className = "space" style = {{width: group.holder.length*10}}/>
                                    <div key = {index} className = "group">
                                        <Link key = {index} to = {newUrl (group._id)}>
                                            <button
                                            className = "buttonGroup"
                                            onClick = {() => handleGroupClick (group)}
                                            onDoubleClick = {() => handleGroupDoubleClick (index, group)}
                                            key = {index}>
                                                {group.name}
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        }
                        else
                        {
                            return (
                                <div key = {index} className = "lockGroup">
                                    <div className = "space" style = {{width: group.holder.length*10}}/>
                                    <div key = {index} className = "lock">
                                        {group.name}
                                    </div>
                                </div>
                            )
                        }
                    }
                )
            }
        </div>
    )
}

export default GroupExplorer;
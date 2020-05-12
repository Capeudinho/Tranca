import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

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
            const runEffect = async () =>
            {
                const response = await api.get
                (
                    "/grouplevelindex",
                    {
                        params:
                        {
                            level: 0
                        }
                    }
                );
                setGroups (response.data);
            }
            runEffect();
        },
        []
    )

    useEffect
    (
        () =>
        {
            var newGroups = groups;
            for (var k = 0; k < groups.length; k++)
            {
                var goBack = false;
                if (k < groups.length && groups[k]._id === deletedGroups.group._id)
                {
                    newGroups.splice (k, 1);
                    goBack = true;
                }
                else if (k < groups.length && groups[k]._id === deletedGroups.newContentGroup._id)
                {
                    newGroups[k] = deletedGroups.newContentGroup;
                }
                for (var j = 0; j < deletedGroups.otherGroups.length; j++)
                {
                    if (j < deletedGroups.otherGroups.length && deletedGroups.otherGroups[j]._id === groups[k]._id)
                    {
                        newGroups.splice (k, 1);
                        goBack = true;
                    }
                }
                for (var i = 0; i < deletedGroups.otherLocks.length; i++)
                {
                    if (k < groups.length && i < deletedGroups.otherLocks.length && deletedGroups.otherLocks[i]._id === groups[k]._id)
                    {
                        newGroups.splice (k, 1);
                        setUpdate (update+1);
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
                if (h < expandedGroups.length && expandedGroups[h]._id === deletedGroups.group._id)
                {
                    newGroups.splice (h, 1);
                    goBack = true;
                }
                else if (h < expandedGroups.length && expandedGroups[h]._id === deletedGroups.newContentGroup._id)
                {
                    newGroups[h] = deletedGroups.newContentGroup;
                }
                for (var f = 0; f < deletedGroups.otherGroups.length; f++)
                {
                    if (f < deletedGroups.otherGroups.length && deletedGroups.otherGroups[f]._id === expandedGroups[h]._id)
                    {
                        newGroups.splice (h, 1);
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
        },
        [deletedGroups]
    )

    useEffect
    (
        () =>
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
            var newGroups = groups;
            for (var k = 0; k < groups.length; k++)
            {
                if (groups[k]._id === deletedLock.lock._id)
                {
                    newGroups.splice (k, 1);
                    k--;
                }
                else if (groups[k]._id === deletedLock.newContentGroup._id)
                {
                    newGroups[k] = deletedLock.newContentGroup;
                    k--;
                }
            }
            setGroups (newGroups);
            setUpdate (update+1);
        },
        [deletedLock]
    )

    useEffect
    (
        () =>
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
        for (var k = 0; k < group.content.length; k++)
        {
            const _id = group.content[k];
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
            setGroups (groups.splice (index+1+k, 0, response.data));
            setGroups (groups);
        }
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
import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import groupPathContext from "../context/groupPathContext";
import deletedGroupsContext from "../context/deletedGroupsContext";
import updatedGroupContext from "../context/updatedGroupContext";
import addedGroupContext from "../context/addedGroupContext";

import "../../css/group/groupExplorer.css";

function GroupExplorer (props)
{
    const {groupPath, setGroupPath} = useContext (groupPathContext);
    const {deletedGroups, setDeletedGroups} = useContext (deletedGroupsContext);
    const {updatedGroup, setUpdatedGroup} = useContext (updatedGroupContext);
    const {addedGroup, setAddedGroup} = useContext (addedGroupContext);
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
                if (groups[k]._id === deletedGroups.group._id)
                {
                    newGroups.splice (k, 1);
                    k--;
                }
                for (var j = 0; j < deletedGroups.otherGroups.length; j++)
                {
                    if (j < deletedGroups.otherGroups.length && deletedGroups.otherGroups[j]._id === groups[k]._id)
                    {
                        newGroups.splice (k, 1);
                        k--;
                    }
                }
            }
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
                )
            }
        </div>
    )
}

export default GroupExplorer;
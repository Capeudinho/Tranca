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

import "../../css/group/groupList.css";

function GroupList ({match})
{
    const {groupPath, setGroupPath} = useContext (groupPathContext);
    const {deletedGroups, setDeletedGroups} = useContext (deletedGroupsContext);
    const {updatedGroup, setUpdatedGroup} = useContext (updatedGroupContext);
    const {addedGroup, setAddedGroup} = useContext (addedGroupContext);
    const {deletedLock, setDeletedLock} = useContext (deletedLockContext);
    const {updatedLock, setUpdatedLock} = useContext (updatedLockContext);
    const {addedLock, setAddedLock} = useContext (addedLockContext);
    const [groups, setGroups] = useState ([]);
    const [update, setUpdate] = useState (0);

    useEffect
    (
        () =>
        {
            let mounted = true;
            const runEffect = async () =>
            {
                const _id = match.params.id;
                const groupResponse = await api.get
                (
                    "/groupidindex",
                    {
                        params:
                        {
                            _id
                        }
                    }
                );
                const content = groupResponse.data.content;
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
                if (mounted)
                {
                    setGroups (response.data);
                }
            }
            runEffect();
            return (() => {mounted = false;});
        },
        [match.url]
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
                        console.log (groups.length);
                        console.log (k);
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
            if (addedGroup.hasOwnProperty ("newGroup") && addedGroup.newGroup.holder[addedGroup.newGroup.holder.length-1] === match.params.id)
            {
                var tempGroups = groups;
                tempGroups.splice (0, 0, addedGroup.newGroup);
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
                    if (k < newGroups.length && newGroups[k]._id === deletedLock.lock._id)
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
            if (addedLock.hasOwnProperty ("newLock") && addedLock.newLock.holder[addedLock.newLock.holder.length-1] === match.params.id)
            {
                var tempGroups = groups;
                tempGroups.splice (0, 0, addedLock.newLock);
                setGroups (tempGroups);
                setUpdate (update+1);
            }
        },
        [addedLock]
    )

    return (
        <div className = "groupListArea">
            <div className = "upperArea">
                <div className = "breadcrumbs">
                    {groupPath}
                </div>
                <Link className = "link" to = {match.url.concat ("/addgroup")}>
                    <button className = "buttonAdd buttonAddGroup">
                        Grupo
                    </button>
                </Link>
                <Link to = {match.url.concat ("/addlock")}>
                    <button className = "buttonAdd buttonAddLock">
                        Tranca
                    </button>
                </Link>
            </div>
            {
                groups.map
                (
                    (group, index) =>
                    {
                        if (group.hasOwnProperty ("content"))
                        {
                            return (
                                <div key = {index} className = "group">
                                    <Link key = {index} to = {match.url.concat ("/group/"+group._id)}>
                                        <button
                                        className = "buttonGroup"
                                        key = {index}>
                                            {group.name}
                                        </button>
                                    </Link>
                                </div>
                            )
                        }
                        else if (group.hasOwnProperty ("_id"))
                        {
                            return (
                                <div key = {index} className = "lock">
                                    <Link key = {index} to = {match.url.concat ("/group/"+group._id)}>
                                        <button
                                        className = "buttonLock"
                                        key = {index}>
                                            {group.name}
                                        </button>
                                    </Link>
                                </div>
                            )
                        }
                    }
                )
            }
        </div>
    )
}

export default GroupList;
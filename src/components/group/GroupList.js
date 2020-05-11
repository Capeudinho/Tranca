import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import groupPathContext from "../context/groupPathContext";
import deletedGroupsContext from "../context/deletedGroupsContext";
import updatedGroupContext from "../context/updatedGroupContext";
import addedGroupContext from "../context/addedGroupContext";

import "../../css/group/groupList.css";

function GroupList ({match})
{
    const {groupPath, setGroupPath} = useContext (groupPathContext);
    const {deletedGroups, setDeletedGroups} = useContext (deletedGroupsContext);
    const {updatedGroup, setUpdatedGroup} = useContext (updatedGroupContext);
    const {addedGroup, setAddedGroup} = useContext (addedGroupContext);
    const [groups, setGroups] = useState ([]);
    const [update, setUpdate] = useState (0);

    useEffect
    (
        () =>
        {
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
                setGroups (response.data);
            }
            runEffect();
        },
        [match.url]
    )

    useEffect
    (
        () =>
        {
            var newGroups = groups;
            for (var k = 0; k < groups.length; k++)
            {
                if (k < groups.length && groups[k]._id === deletedGroups.group._id)
                {
                    newGroups.splice (k, 1);
                    setUpdate (update+1);
                    k--;
                }
                for (var j = 0; j < deletedGroups.otherGroups.length; j++)
                {
                    if (k < groups.length && j < deletedGroups.otherGroups.length && deletedGroups.otherGroups[j]._id === groups[k]._id)
                    {
                        newGroups.splice (k, 1);
                        setUpdate (update+1);
                        k--;
                    }
                }
            }
            setGroups (newGroups);
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

    return (
        <div className = "groupListArea">
            <div className = "upperArea">
                <div className = "breadcrumbs">
                    {groupPath}
                </div>
                <Link to = {match.url.concat ("/addgroup")}>
                    <button className = "buttonAdd buttonAddGroup">
                        Grupo
                    </button>
                </Link>
                <button className = "buttonAdd buttonAddTranca">
                    Tranca
                </button>
            </div>
            {
                groups.map
                (
                    (group, index) =>
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
                )
            }
        </div>
    )
}

export default GroupList;
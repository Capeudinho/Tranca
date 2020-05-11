import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import deletedGroupsContext from "../context/deletedGroupsContext";
import updatedGroupContext from "../context/updatedGroupContext";

import "../../css/group/groupInfo.css";

function GroupInfo ({match})
{
    const {deletedGroups, setDeletedGroups} = useContext (deletedGroupsContext);
    const {updatedGroup, setUpdatedGroup} = useContext (updatedGroupContext);
    const [group, setGroup] = useState ({});

    useEffect
    (
        () =>
        {
            const runEffect = async () =>
            {
                const _id = match.params.id;
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
                setGroup (response.data);
            }
            runEffect();
        },
        [match]
    )

    useEffect
    (
        () =>
        {
            if (updatedGroup._id === group._id)
            {
                setGroup (updatedGroup);
            }
        },
        [updatedGroup]
    )

    async function handleDeleteGroup (_id)
    {
        if (window.confirm(`Você realmente deseja remover o grupo ${group.name}?`))
        {
            const response = await api.delete
            (
                "/groupiddestroy",
                {
                    params:
                    {
                        _id
                    }
                }
            );
            if (response.data.group._id === _id)
            {
                window.alert(`O grupo ${group.name} foi excluído.`);
                setDeletedGroups (response.data);
            }
        }
    }

    return (
        <div className = "baseRightArea">
            <div className = "name">{group.name}</div>
            <Link to = {match.url.concat ("/edit")}>
                <button
                className = "buttonEdit"
                >
                    Editar
                </button>
            </Link>
            <Link to = {match.url.replace ("/group/"+group._id, "")}>
                <button
                className = "buttonDelete"
                onClick = {() => handleDeleteGroup (group._id)}
                >
                    Excluir
                </button>
            </Link>
        </div>
    )
}

export default GroupInfo;
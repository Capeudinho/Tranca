import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import deletedGroupsContext from "../context/deletedGroupsContext";
import updatedGroupContext from "../context/updatedGroupContext";
import deletedLockContext from "../context/deletedLockContext";
import updatedLockContext from "../context/updatedLockContext";

import "../../css/group/groupInfo.css";

function GroupInfo ({match})
{
    const {deletedGroups, setDeletedGroups} = useContext (deletedGroupsContext);
    const {updatedGroup, setUpdatedGroup} = useContext (updatedGroupContext);
    const {deletedLock, setDeletedLock} = useContext (deletedLockContext);
    const {updatedLock, setUpdatedLock} = useContext (updatedLockContext);
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

    useEffect
    (
        () =>
        {
            if (updatedLock._id === group._id)
            {
                setGroup (updatedLock);
            }
        },
        [updatedLock]
    )

    async function handleDeleteGroup (_id)
    {
        if (group.hasOwnProperty ("content") && group.holder.length !== 0)
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
        else if (group.hasOwnProperty ("content") && group.holder.length === 0)
        {
            window.alert(`Você não pode excluir esse grupo.`);
        }
        else
        {
            if (window.confirm(`Você realmente deseja remover a tranca ${group.name}?`))
            {
                const response = await api.delete
                (
                    "/lockiddestroy",
                    {
                        params:
                        {
                            _id
                        }
                    }
                );
                if (response.data._id === _id)
                {
                    window.alert(`A tranca ${group.name} foi excluído.`);
                    setDeletedLock (response.data);
                }
            }
        }
    }

    function TypeAttributes ()
    {
        if (group.hasOwnProperty ("content"))
        {
            return (
                <div className = "type">Grupo</div>
            )
        }
        else
        {
            return (
                <div className = "type">Tranca</div>
            )
        }
    }

    return (
        <div className = "groupInfoArea">
            <div className = "name">{group.name}</div>
            <TypeAttributes/>
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
import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link, Redirect} from "react-router-dom";

import deletedGroupsContext from "../context/deletedGroupsContext";
import updatedGroupContext from "../context/updatedGroupContext";
import deletedLockContext from "../context/deletedLockContext";
import updatedLockContext from "../context/updatedLockContext";
import messageContext from "../context/messageContext";

import "../../css/group/groupInfo.css";

function GroupInfo ({match})
{
    const {deletedGroups, setDeletedGroups} = useContext (deletedGroupsContext);
    const {updatedGroup, setUpdatedGroup} = useContext (updatedGroupContext);
    const {deletedLock, setDeletedLock} = useContext (deletedLockContext);
    const {updatedLock, setUpdatedLock} = useContext (updatedLockContext);
    const {message, setMessage} = useContext (messageContext);
    const [group, setGroup] = useState ({});
    const [redirect, setRedirect] = useState (<div/>);
    const [confirm, setConfirm] = useState (false);

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
                    "/groupidindex",
                    {
                        params:
                        {
                            _id
                        }
                    }
                );
                if (mounted && response.data !== null)
                {
                    setGroup (response.data);
                }
            }
            runEffect();
            return (() => {mounted = false;});
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
                setDeletedGroups (response.data);
                setRedirect (<Redirect to = {match.url.replace ("/"+group._id, "")}/>);
                setMessage (`O grupo ${group.name} foi excluído.`);
            }
        }
        else if (group.hasOwnProperty ("content") && group.holder.length === 0)
        {
            setMessage ("Você não pode excluir esse grupo.");
        }
        else
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
            if (response.data.lock._id === _id)
            {
                setDeletedLock (response.data);
                setRedirect (<Redirect to = {match.url.replace ("/"+group._id, "")}/>);
                setMessage (`A tranca ${group.name} foi excluída.`);
            }
        }
    }

    return (
        <div className = "groupInfoArea">
            {redirect}
            <div className = "name">{group.name}</div>
            <div className = "type">{group.hasOwnProperty ("content") ? "Grupo" : "Tranca"}</div>
            <Link to = {match.url.concat ("/edit")}>
                <button className = "buttonEdit">Editar</button>
            </Link>
            <button
            className = "buttonDelete"
            onClick =
            {
                () =>
                {
                    if (confirm)
                    {
                        handleDeleteGroup (group._id);
                    }
                    else
                    {
                        setConfirm (true);
                    }
                }
            }
            >
                {confirm ? "Confirmar exclusão" : "Excluir"}
            </button>
        </div>
    )
}

export default GroupInfo;
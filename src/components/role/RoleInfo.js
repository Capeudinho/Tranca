import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link, Redirect} from "react-router-dom";

import deletedRoleContext from "../context/deletedRoleContext";
import updatedRoleContext from "../context/updatedRoleContext";
import messageContext from "../context/messageContext";

import "../../css/role/roleInfo.css";

function RoleInfo ({match})
{
    const {deletedRole, setDeletedRole} = useContext (deletedRoleContext);
    const {updatedRole, setUpdatedRole} = useContext (updatedRoleContext);
    const {message, setMessage} = useContext (messageContext);
    const [role, setRole] = useState
    (
        {
            name: ""
        }
    );
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
                    "/roleidindex",
                    {
                        params:
                        {
                            _id
                        }
                    }
                )
                if (mounted && response.data !== null)
                {
                    setRole (response.data);
                }
                setConfirm (false);
            }
            runEffect();
            return (() => {mounted = false;});
        },
        [match]
    );

    useEffect
    (
        () =>
        {
            if (role._id === updatedRole._id)
            {
                setRole (updatedRole);
            }
        },
        [updatedRole]
    );

    async function handleDeleteRole (_id)
    {
        const response = await api.delete
        (
            "/roleiddestroy",
            {
                params:
                {
                    _id
                }
            }
        );
        if (response.data._id === _id)
        {
            setDeletedRole (role);
            setMessage (`O papel ${role.name} foi excluído.`);
            setRedirect (<Redirect to = {match.url.replace ("/"+role._id, "")}/>);
        }
    }

    return (
        <div className = "roleInfoArea">
            {redirect}
            <div className = "name">{role.name}</div>
            <div className = "type">Papel</div>
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
                        handleDeleteRole (role._id);
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

export default RoleInfo;
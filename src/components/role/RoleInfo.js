import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import deletedRoleContext from "../context/deletedRoleContext";
import updatedRoleContext from "../context/updatedRoleContext";

import "../../css/role/roleInfo.css";

function RoleInfo ({match})
{
    const {deletedRole, setDeletedRole} = useContext (deletedRoleContext);
    const {updatedRole, setUpdatedRole} = useContext (updatedRoleContext);
    const [role, setRole] = useState ({});

    useEffect
    (
        () =>
        {
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
                setRole (response.data);
            }
            runEffect();
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
        if (window.confirm(`Você realmente deseja remover a função ${role.name}?`))
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
                window.alert(`A função ${role.name} foi excluída.`);
                setDeletedRole (role);
            }
        }
    }

    return (
        <div className = "roleInfoArea">
            <div className = "name">{role.name}</div>
            <div className = "type">Função</div>
            <Link to = {match.url.concat ("/edit")}>
                <button
                className = "buttonEdit"
                >
                    Editar
                </button>
            </Link>
            <Link to = {match.url.replace (role._id, "")}>
                <button
                className = "buttonDelete"
                onClick = {() => handleDeleteRole (role._id)}
                >
                    Excluir
                </button>
            </Link>
        </div>
    )
}

export default RoleInfo;
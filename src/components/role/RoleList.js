import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import deletedRoleContext from "../context/deletedRoleContext";
import updatedRoleContext from "../context/updatedRoleContext";
import addedRoleContext from "../context/addedRoleContext";

import "../../css/role/roleList.css";

function RoleList ()
{
    const {deletedRole, setDeletedRole} = useContext (deletedRoleContext);
    const {updatedRole, setUpdatedRole} = useContext (updatedRoleContext);
    const {addedRole, setAddedRole} = useContext (addedRoleContext);
    const [roles, setRoles] = useState ([]);
    const [page, setPage] = useState (1);
    const [pageLimit, setPageLimit] = useState (1);

    useEffect
    (
        () =>
        {
            setPage (page);
        },
        []
    );

    useEffect
    (
        () =>
        {
            const runEffect = async () =>
            {
                const response = await api.get
                (
                    "/rolelistpag",
                    {
                        params:
                        {
                            page
                        }
                    }
                );
                setPageLimit (response.data.pages);
                setRoles ([...roles, ...response.data.docs]);
            }
            runEffect();
        },
        [page]
    );

    useEffect
    (
        () =>
        {
            if (deletedRole.hasOwnProperty ("_id"))
            {
                roles.map
                (
                    (role, index) =>
                    {
                        if (role._id === deletedRole._id)
                        {
                            roles.splice (index, 1);
                        }
                    }
                )
            }
        },
        [deletedRole]
    );

    useEffect
    (
        () =>
        {
            if (updatedRole.hasOwnProperty ("_id"))
            {
                roles.map
                (
                    (role, index) =>
                    {
                        if (role._id === updatedRole._id)
                        {
                            var newRoles = [...roles];
                            newRoles[index] = updatedRole;
                            setRoles(newRoles);
                        }
                    }
                )
            }
        },
        [updatedRole]
    );

    useEffect
    (
        () =>
        {
            if (addedRole.hasOwnProperty ("_id"))
            {
                var newRoles = [...roles];
                newRoles.unshift (addedRole);
                setRoles (newRoles);
            }
        },
        [addedRole]
    );

    return (
        <div className = "roleListArea">
            {
                roles.map
                (
                    (role, index) =>
                    {
                        return (
                            <div key = {index} className = "user">
                                <Link key = {index} to = {`/listroles/${role._id}`}>
                                    <button
                                    className = "buttonUser"
                                    key = {index}>
                                        {role.name}
                                    </button>
                                </Link>
                            </div>
                        )
                    }
                )
            }
            <button
            className = "buttonLoadMore"
            onClick = {() => {if (page < pageLimit) {setPage (page+1)}}}>
                Carregar mais
            </button>
        </div>
    )
}

export default RoleList;
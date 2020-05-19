import React, {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import api from "../../services/api";

import deletedRoleContext from "../context/deletedRoleContext";
import updatedRoleContext from "../context/updatedRoleContext";
import addedRoleContext from "../context/addedRoleContext";

import "../../css/role/roleSearch.css";

function RoleSearch ({match})
{
    const {deletedRole, setDeletedRole} = useContext (deletedRoleContext);
    const {updatedRole, setUpdatedRole} = useContext (updatedRoleContext);
    const {addedRole, setAddedRole} = useContext (addedRoleContext);
    const [roles, setRoles] = useState ([]);
    const [page, setPage] = useState (1);
    const [pageLimit, setPageLimit] = useState (1);
    const [update, setUpdate] = useState (0);

    useEffect
    (
        () =>
        {
            setRoles ([]);
            setPage (1);
            setUpdate (update+1);
            console.log (match);
        },
        [match.params.name]
    );

    useEffect
    (
        () =>
        {
            const runEffect = async () =>
            {
                const name = match.params.name;
                const response = await api.get
                (
                    "/rolenamelistpag",
                    {
                        params:
                        {
                            page,
                            name
                        }
                    }
                );
                setPageLimit (response.data.pages);
                setRoles ([...roles, ...response.data.docs]);
            }
            runEffect();
        },
        [page, update]
    )

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
            if (addedRole.hasOwnProperty ("_id") && addedRole.name.includes (match.params.name))
            {
                var newRoles = [...roles];
                newRoles.unshift (addedRole);
                setRoles (newRoles);
            }
        },
        [addedRole]
    );

    return (
        <div className = "roleSearchArea">
            {
                roles.map
                (
                    (role, index) =>
                    {
                        return (
                            <div key = {index} className = "role">
                                <Link to = {`/searchroles/${match.params.name}/${role._id}`}>
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

export default RoleSearch;
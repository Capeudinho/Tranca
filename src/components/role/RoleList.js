import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import currentCentralContext from "../context/currentCentralContext";
import deletedRoleContext from "../context/deletedRoleContext";
import updatedRoleContext from "../context/updatedRoleContext";
import addedRoleContext from "../context/addedRoleContext";

import "../../css/role/roleList.css";

function RoleList ()
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {deletedRole, setDeletedRole} = useContext (deletedRoleContext);
    const {updatedRole, setUpdatedRole} = useContext (updatedRoleContext);
    const {addedRole, setAddedRole} = useContext (addedRoleContext);
    const [roles, setRoles] = useState ([]);
    const [page, setPage] = useState (1);
    const [pageLimit, setPageLimit] = useState (1);
    const [name, setName] = useState ("");
    const [update, setUpdate] = useState (0);

    useEffect
    (
        () =>
        {
            let mounted = true;
            const runEffect = async () =>
            {
                const owner = currentCentral._id;
                const response = await api.get
                (
                    "/rolelistpag",
                    {
                        params:
                        {
                            page,
                            name,
                            owner
                        }
                    }
                );
                if (mounted)
                {
                    setPageLimit (response.data.pages);
                    setRoles ([...roles, ...response.data.docs]);
                }
            }
            runEffect();
            return (() => {mounted = false;});
        },
        [page, update]
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
                            var newRoles = [...roles];
                            newRoles.splice (index, 1);
                            setRoles (newRoles);
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
                            setRoles (newRoles);
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

    function handleChangeName (e)
    {
        const value = e.target.value;
        setName (value);
    }

    function handleSubmit (e)
    {
        e.preventDefault ();
        setPage (1);
        setRoles ([]);
        setUpdate (update+1);
    }

    return (
        <div className = "roleListArea">
            <div className = "searchBar">
                <form className = "nameInputGroup">
                    <label>Nome</label>
                    <input
                    value = {name}
                    onChange = {(e) => handleChangeName (e)}
                    placeholder = "Nome"
                    />
                    <button className = "buttonSearch" onClick = {(e) => handleSubmit (e)}>Pesquisar</button>
                </form>
                <Link to = "/roles/addrole">
                    <button className = "buttonAdd buttonAddRole">
                        Papel
                    </button>
                </Link>
            </div>
            {
                roles.map
                (
                    (role, index) =>
                    {
                        return (
                            <div key = {index} className = "role">
                                <Link key = {index} to = {`/roles/${role._id}`}>
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
            style = {{opacity: page === pageLimit ? 0.5 : 1}}
            onClick = {() => {if (page < pageLimit) {setPage (page+1)}}}>
                Carregar mais
            </button>
        </div>
    )
}

export default RoleList;
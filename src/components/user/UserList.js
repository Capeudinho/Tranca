import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import currentCentralContext from "../context/currentCentralContext";
import deletedUserContext from "../context/deletedUserContext";
import updatedUserContext from "../context/updatedUserContext";
import addedUserContext from "../context/addedUserContext";

import "../../css/user/userList.css";

function UserList ()
{
    const {currentCentral, setCurrentCentral} = useContext (currentCentralContext);
    const {deletedUser, setDeletedUser} = useContext (deletedUserContext);
    const {updatedUser, setUpdatedUser} = useContext (updatedUserContext);
    const {addedUser, setAddedUser} = useContext (addedUserContext);
    const [users, setUsers] = useState ([]);
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
                    "/userlistpag",
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
                    setUsers ([...users, ...response.data.docs]);
                }
            }
            runEffect ();
            return (() => {mounted = false;});
        },
        [page, update]
    );

    useEffect
    (
        () =>
        {
            if (deletedUser.hasOwnProperty ("_id"))
            {
                users.map
                (
                    (user, index) =>
                    {
                        if (user._id === deletedUser._id)
                        {
                            var newUsers = [...users];
                            newUsers.splice (index, 1);
                            setUsers (newUsers);
                        }
                    }
                )
            }
        },
        [deletedUser]
    );

    useEffect
    (
        () =>
        {
            if (updatedUser.hasOwnProperty ("_id"))
            {
                users.map
                (
                    (user, index) =>
                    {
                        if (user._id === updatedUser._id)
                        {
                            var newUsers = [...users];
                            newUsers [index] = updatedUser;
                            setUsers (newUsers);
                        }
                    }
                )
            }
        },
        [updatedUser]
    );

    useEffect
    (
        () =>
        {
            if (addedUser.hasOwnProperty ("_id"))
            {
                var newUsers = [...users];
                newUsers.unshift (addedUser);
                setUsers (newUsers);
            }
        },
        [addedUser]
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
        setUsers ([]);
        setUpdate (update+1);
    }

    return (
        <div className = "userListArea">
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
                <Link to = "/users/adduser">
                    <button className = "buttonAdd buttonAddUser" type = "button">
                        Usuário
                    </button>
                </Link>
            </div>
            {
                users.map
                (
                    (user, index) =>
                    {
                        return (
                            <div key = {index} className = "user">
                                <Link key = {index} to = {`/users/${user._id}`}>
                                    <button
                                    className = "buttonUser"
                                    type = "button"
                                    key = {index}>
                                        {user.name}
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

export default UserList;
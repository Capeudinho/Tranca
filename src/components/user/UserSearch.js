import React, {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import api from "../../services/api";

import deletedUserContext from "../context/deletedUserContext";
import updatedUserContext from "../context/updatedUserContext";
import addedUserContext from "../context/addedUserContext";

import "../../css/user/userSearch.css";

function UserSearch ({match})
{
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
            setUsers ([]);
            setPage (1);
            setUpdate (update+1);
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
                    "/usernamelistpag",
                    {
                        params:
                        {
                            page,
                            name
                        }
                    }
                );
                setPageLimit (response.data.pages);
                setUsers ([...users, ...response.data.docs]);
            }
            runEffect();
        },
        [page, update]
    )

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
                            users.splice (index, 1);
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
                            setUsers(newUsers);
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
            if (addedUser.hasOwnProperty ("_id") && addedUser.name.includes (match.params.name))
            {
                var newUsers = [...users];
                newUsers.unshift (addedUser);
                setUsers (newUsers);
            }
        },
        [addedUser]
    );

    return (
        <div className = "userSearchArea">
            {
                users.map
                (
                    (user, index) =>
                    {
                        return (
                            <div key = {index} className = "user">
                                <Link key = {index} to = {`/searchusers/${match.params.name}/${user._id}`}>
                                    <button
                                    className = "buttonUser"
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

export default UserSearch;
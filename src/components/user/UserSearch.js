import React, {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import api from "../../services/api";

import deletedUserContext from "../context/deletedUserContext";
import updatedUserContext from "../context/updatedUserContext";

import "../../css/user/userSearch.css";

function UserSearch ({match})
{
    const {deletedUser, setDeletedUser} = useContext (deletedUserContext);
    const {updatedUser, setUpdatedUser} = useContext (updatedUserContext);
    const [users, setUsers] = useState ([]);
    const [name, setName] = useState ("");
    const [page, setPage] = useState (1);
    const [pageLimit, setPageLimit] = useState (1);
    const [update, setUpdate] = useState (false);

    useEffect
    (
        () =>
        {
            if (match.params.name !== name)
            {
                setName (match.params.name);
                setUsers ([]);
                if (page === 1)
                {
                    if (update === false)
                    {
                        setUpdate (true);
                    }
                    else
                    {
                        setUpdate (false)
                    }
                }
                else
                {
                    setPage (1);
                }
            }
        },
        [match]
    );

    useEffect
    (
        () =>
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
        },
        [deletedUser]
    );

    useEffect
    (
        () =>
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
        },
        [updatedUser]
    );

    useEffect
    (
        () =>
        {
            const runEffect = async () =>
            {
                const response = await api.get
                (
                    `/usernamelistpag?page=${page}`,
                    {
                        params:
                        {
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
import React, {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import api from "../../services/api";

import deletedUserContext from "../context/deletedUserContext";

import "../../css/user/userSearch.css";

function UserSearch ({match})
{
    const {deletedUser, setDeletedUser} = useContext (deletedUserContext);
    const [users, setUsers] = useState ([]);
    const [value, setValue] = useState ("");
    const [page, setPage] = useState (1);

    useEffect
    (
        () =>
        {
            setValue (match);
        },
        [match]
    );

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
            users.map
            (
                (user, index) =>
                {
                    if (user._id === deletedUser._id)
                    {
                        users.splice (index, 1);
                        setDeletedUser ({});
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
            const runEffect = async () =>
            {
                const name = match.params.name;
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
                setUsers ([...users, ...response.data.docs]);
            }
            runEffect();
            
        },
        [page]
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
            onClick = {() => setPage (page+1)}>
                Carregar mais
            </button>
        </div>
    )
}

export default UserSearch;
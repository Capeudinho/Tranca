import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import deletedUserContext from "../context/deletedUserContext";

import "../../css/user/userList.css";

function UserList ()
{
    const {deletedUser, setDeletedUser} = useContext (deletedUserContext);
    const [users, setUsers] = useState ([]);
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
            try
            {
                const runEffect = async () =>
                {
                    const response = await api.get
                    (
                        `/userlistpag?page=${page}`
                    );
                    setPageLimit (response.data.pages);
                    setUsers ([...users, ...response.data.docs]);
                }
                runEffect();
            }
            catch (error)
            {
                console.log (error);
            }
        },
        [page]
    );

    return (
        <div className = "userListArea">
            {
                users.map
                (
                    (user, index) =>
                    {
                        return (
                            <div key = {index} className = "user">
                                <Link key = {index} to = {`/listusers/${user._id}`}>
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

export default UserList;
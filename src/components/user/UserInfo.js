import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import deletedUserContext from "../context/deletedUserContext";
import updatedUserContext from "../context/updatedUserContext";

import "../../css/user/userInfo.css";

function UserInfo ({match})
{
    const {deletedUser, setDeletedUser} = useContext (deletedUserContext);
    const {updatedUser, setUpdatedUser} = useContext (updatedUserContext);
    const [user, setUser] = useState ({});
    const [update, setUpdate] = useState (0);


    useEffect
    (
        () =>
        {
            const runEffect = async () =>
            {
                const _id = match.params.id;
                const response = await api.get
                (
                    "/useridindex",
                    {
                        params:
                        {
                            _id
                        }
                    }
                );
                setUser (response.data);
                setUpdate (update+1);
            }
            runEffect();
        },
        [match]
    );

    useEffect
    (
        () =>
        {
            if (updatedUser !== {} && user._id === updatedUser._id)
            {
                setUser(updatedUser);
            }
        },
        [updatedUser]
    );

    async function handleDeleteUser (_id)
    {
        if (window.confirm(`Você realmente deseja remover o usuário ${user.name}?`))
        {
            const response = await api.delete
            (
                "/useriddestroy",
                {
                    params:
                    {
                        _id
                    }
                }
            );
            if (response.data._id === _id)
            {
                window.alert(`O usuário ${user.name} foi excluído.`);
                setDeletedUser (user);
            }
        }
    }

    function OtherAttributes ()
    {
        if (user !== null && user !== undefined && user.hasOwnProperty ("name") && user.hasOwnProperty ("email"))
        {
            return (
                <div>
                    <div className = "name">{user.name}</div>
                    <div className = "email">{user.email}</div>
                </div>
            )
        }
        else
        {
            return <div/>
        }
    }

    return (
        <div className = "userInfoArea">
            <OtherAttributes/>
            <Link to = {match.url.concat ("/edit")}>
                <button
                className = "buttonEdit"
                >
                    Editar
                </button>
            </Link>
            <Link to = {match.url.replace (user._id, "")}>
                <button
                className = "buttonDelete"
                onClick = {() => handleDeleteUser (user._id)}
                >
                    Excluir
                </button>
            </Link>
        </div>
    )
}

export default UserInfo;
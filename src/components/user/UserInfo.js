import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

import deletedUserContext from "../context/deletedUserContext";

import "../../css/user/userInfo.css";

function UserInfo ({match})
{
    const {deletedUser, setDeletedUser} = useContext (deletedUserContext);
    const [user, setUser] = useState ({});
    const [_id, set_id] = useState ("");


    useEffect
    (
        () =>
        {
            if (user.hasOwnProperty ("_id") === false)
            {
                set_id (match.params.id);
            }
            else
            {
                if (user._id !== match.params.id)
                {
                    set_id (match.params.id);
                }
            }
            const runEffect = async () =>
            {
                const response = await api.get
                (
                    "/useridindex",
                    {
                        params:
                        {
                            _id
                        }
                    }
                )
                if (user.hasOwnProperty ("name") === false)
                {
                    setUser (response.data);
                }
                else
                {
                    if (user.name !== response.data.name)
                    {
                        setUser (response.data);
                    }
                }
            }
            runEffect();
        }
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

    return (
        <div className = "userInfoArea">
            <div className = "name">{user.name}</div>
            <div className = "email">{user.email}</div>
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
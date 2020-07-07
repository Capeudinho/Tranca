import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import {Link, Redirect} from "react-router-dom";

import deletedUserContext from "../context/deletedUserContext";
import updatedUserContext from "../context/updatedUserContext";
import messageContext from "../context/messageContext";

import "../../css/user/userInfo.css";

function UserInfo ({match})
{
    const {deletedUser, setDeletedUser} = useContext (deletedUserContext);
    const {updatedUser, setUpdatedUser} = useContext (updatedUserContext);
    const {message, setMessage} = useContext (messageContext);
    const [user, setUser] = useState
    (
        {
            name: "",
            email: "",
        }
    );
    const [redirect, setRedirect] = useState (<div/>);
    const [confirm, setConfirm] = useState (false);
    const [update, setUpdate] = useState (0);


    useEffect
    (
        () =>
        {
            let mounted = true;
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
                if (mounted && response.data !== null)
                {
                    setUser (response.data);
                    setUpdate (update+1);
                }
            }
            runEffect();
            return (() => {mounted = false;});
        },
        [match]
    );

    useEffect
    (
        () =>
        {
            if (updatedUser !== {} && user._id === updatedUser._id)
            {
                setUser (updatedUser);
            }
        },
        [updatedUser]
    );

    async function handleDeleteUser (_id)
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
            setDeletedUser (user);
            setMessage (`O usuário ${user.name} foi excluído.`);
            setRedirect (<Redirect to = {match.url.replace ("/"+user._id, "")}/>);
        }
    }

    return (
        <div className = "userInfoArea">
            {redirect}
            <div className = "name">{user.name}</div>
            <div className = "type">Usuário</div>
            <Link to = {match.url.concat ("/edit")}>
                <button className = "buttonEdit">Editar</button>
            </Link>
            <button
            className = "buttonDelete"
            onClick =
            {
                () =>
                {
                    if (confirm)
                    {
                        handleDeleteUser (user._id);
                    }
                    else
                    {
                        setConfirm (true);
                    }
                }
            }
            >
                {confirm ? "Confirmar exclusão" : "Excluir"}
            </button>
        </div>
    )
}

export default UserInfo;
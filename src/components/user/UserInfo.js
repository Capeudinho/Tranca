import React, {useState, useEffect} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

function UserInfo ({match})
{
    const [user, setUser] = useState ({});
    const [_id, set_id] = useState ("");

    useEffect
    (
        () =>
        {
            let cancel = false;
            
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
                    "/searchuser",
                    {
                        params:
                        {
                            _id
                        }
                    }
                )
                if (cancel) {return;}
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
            return () => {cancel = true;}
        }
    );

    async function handleDeleteUser (_id)
    {
        if (window.confirm(`Você realmente deseja remover o usuário ${user.name}?`))
        {const response = await api.delete
            (
                "/users",
                {
                    params:
                        {
                            _id
                        }
                }
            );}
    }

    return (
        <div>
            <h1>{user.name}</h1>
            <div>{user.email}</div>
            <Link to = "/listusers">
                <button onClick = {() => handleDeleteUser (user._id)}>Deletar</button>
            </Link>
        </div>
    )
}

export default UserInfo;
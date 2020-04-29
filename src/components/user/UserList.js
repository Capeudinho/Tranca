import React, {useState, useEffect} from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

function UserList ()
{
    const [users, setUsers] = useState ([]);

    useEffect
    (
        () =>
        {
            try {
                let cancel = false;
                const runEffect = async () =>
                {
                    const response = await api.get
                    (
                        "/users"
                    );
                    if (cancel) {return;}
                    setUsers (response.data);
                }
                runEffect();
                return () => {cancel = true;}
            }
            catch (error)
            {
                console.log (error);
            }
        }
    );

    return (
        <div>
            {
                users.map
                (
                    (user, index) =>
                    {
                        return (
                            <Link key = {index} to = {`/listusers/${user._id}`}>
                                <button key = {index}>
                                    {user.name}
                                </button>
                            </Link>
                        )
                    }
                )
            }
        </div>
    )
}

export default UserList;
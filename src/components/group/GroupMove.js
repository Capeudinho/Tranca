import React, {useContext} from "react";
import api from "../../services/api";

import movedGroupContext from "../context/movedGroupContext";
import messageContext from "../context/messageContext";

import "../../css/group/groupMove.css";

function GroupMove (props)
{
    const {movedGroup, setMovedGroup} = useContext (movedGroupContext);
    const {message, setMessage} = useContext (messageContext);

    async function move ()
    {
        const path = props.location.pathname.split ("/");
        const response = await api.put
        (
            "/groupidupdatemove",
            {
                item_id: path[4],
                dest_id: path[2]
            }
        );
        if (response.data === null)
        {
            setMessage ("Esse item não pode ser movido para esse grupo");
        }
        else
        {
            //setMovedGroup (Object.assign (response.data, {update: 0}));
            setMovedGroup (response.data);
            setMessage (`O item ${response.data.newItem.name} foi movido para o grupo ${response.data.newDest.name}.`);
        }
    }

    return (
        <div className = "groupMoveArea">
            <p>
                Mude a seção central da tela para o grupo para o qual você deseja mover este item e depois clique no botão abaixo para confirmar.
            </p>
            <button
            onClick = {() => {move ()}}
            className = "buttonConfirm"
            >
                Confirmar
            </button>
        </div>
    )
}

export default GroupMove;
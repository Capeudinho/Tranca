import React, {useState, useEffect} from "react";
import api from "../services/api";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";

import "../global.css";
import "../css/app.css";

import CentralLogin from "./central/CentralLogin";
import CentralMenu from "./central/CentralMenu";

import BaseTop from "./base/BaseTop";
import BaseLeft from "./base/BaseLeft";
import BaseCenter from "./base/BaseCenter";
import BaseRight from "./base/BaseRight";

import GroupExplorer from "./group/GroupExplorer";
import GroupList from "./group/GroupList";
import GroupInfo from "./group/GroupInfo";
import GroupAdd from "./group/GroupAdd";
import GroupEdit from "./group/GroupEdit";
import GroupMove from "./group/GroupMove";
import LockAdd from "./group/LockAdd";

import UserAdd from "./user/UserAdd";
import UserList from "./user/UserList";
import UserInfo from "./user/UserInfo";
import UserEdit from "./user/UserEdit";

import RoleList from "./role/RoleList";
import RoleInfo from "./role/RoleInfo";
import RoleEdit from "./role/RoleEdit";
import RoleAdd from "./role/RoleAdd";

import ActivityList from "./activity/ActivityList";
import ActivityInfo from "./activity/ActivityInfo";

import currentCentralContext from "./context/currentCentralContext";
import allRolesContext from "./context/allRolesContext";
import messageContext from "./context/messageContext";
import groupPathContext from "./context/groupPathContext";
import deletedUserContext from "./context/deletedUserContext";
import updatedUserContext from "./context/updatedUserContext";
import addedUserContext from "./context/addedUserContext";
import deletedGroupsContext from "./context/deletedGroupsContext";
import updatedGroupContext from "./context/updatedGroupContext";
import movedGroupContext from "./context/movedGroupContext";
import addedGroupContext from "./context/addedGroupContext";
import deletedLockContext from "./context/deletedLockContext";
import updatedLockContext from "./context/updatedLockContext";
import addedLockContext from "./context/addedLockContext";
import deletedRoleContext from "./context/deletedRoleContext";
import updatedRoleContext from "./context/updatedRoleContext";
import addedRoleContext from "./context/addedRoleContext";

function App ()
{
  const [currentCentral, setCurrentCentral] = useState ({});
  const [allRoles, setAllRoles] = useState ([]);
  const [message, setMessage] = useState ("");
  const [groupPath, setGroupPath] = useState ("");
  const [deletedUser, setDeletedUser] = useState ([]);
  const [updatedUser, setUpdatedUser] = useState ([]);
  const [addedUser, setAddedUser] = useState ([]);
  const [deletedGroups, setDeletedGroups] = useState ([]);
  const [updatedGroup, setUpdatedGroup] = useState ([]);
  const [movedGroup, setMovedGroup] = useState ([])
  const [addedGroup, setAddedGroup] = useState ([]);
  const [deletedLock, setDeletedLock] = useState ([]);
  const [updatedLock, setUpdatedLock] = useState ([]);
  const [addedLock, setAddedLock] = useState ([]);
  const [deletedRole, setDeletedRole] = useState ([]);
  const [updatedRole, setUpdatedRole] = useState ([]);
  const [addedRole, setAddedRole] = useState ([]);

  useEffect
  (
    () =>
    {
      if (currentCentral.hasOwnProperty ("name"))
      {
        const runEffect = async () =>
        {
          const response = await api.get
          (
            "/rolelist",
            {
              params:
              {
                owner: currentCentral._id
              }
            }
          );
          setAllRoles (response.data);
        }
        runEffect();
      }
    },
    [currentCentral]
  );

  function Login ()
  {
    if (currentCentral.hasOwnProperty ("name"))
    {
      return <div/>
    }
    else if (localStorage.getItem ("central") !== null)
    {
      const central = JSON.parse (localStorage.getItem ("central"));
      setCurrentCentral (central);
      return <div/>
    }
    else
    {
      return <Redirect to = "/login"/>
    }
  }

  return (
    <BrowserRouter>
      <div id = "app">
        <Route path = "/" component = {Login}/>
        
        <currentCentralContext.Provider value = {{currentCentral, setCurrentCentral}}>
        <messageContext.Provider value = {{message, setMessage}}>
          <Switch>

            <Route path = "/login" component = {CentralLogin}/>

            <Route
            path = "/menu"
            render =
            {
              () =>
              {
                return (
                  <div className = "menu">
                    <BaseTop/>
                    <div className = "sectionMainMenu">
                      <div className = "section sectionMain sectionLeft">
                        <BaseLeft/>
                      </div>
                      <div className = "section sectionMain sectionAll">
                        <CentralMenu/>
                      </div>
                    </div>
                  </div>
                )
              }
            }
            />

            <>
              <div className = "section sectionTop">
                <Route path = "/" component = {BaseTop}/>
              </div>

              <div className = "main">
                <div className = "section sectionMain sectionLeft">
                  <Route path = "/" component = {BaseLeft}/>
                </div>

                <allRolesContext.Provider value = {{allRoles, setAllRoles}}>
                <groupPathContext.Provider value = {{groupPath, setGroupPath}}>
                <deletedUserContext.Provider value = {{deletedUser, setDeletedUser}}>
                <updatedUserContext.Provider value = {{updatedUser, setUpdatedUser}}>
                <addedUserContext.Provider value = {{addedUser, setAddedUser}}>
                <deletedGroupsContext.Provider value = {{deletedGroups, setDeletedGroups}}>
                <updatedGroupContext.Provider value = {{updatedGroup, setUpdatedGroup}}>
                <movedGroupContext.Provider value = {{movedGroup, setMovedGroup}}>
                <addedGroupContext.Provider value = {{addedGroup, setAddedGroup}}>
                <deletedLockContext.Provider value = {{deletedLock, setDeletedLock}}>
                <updatedLockContext.Provider value = {{updatedLock, setUpdatedLock}}>
                <addedLockContext.Provider value = {{addedLock, setAddedLock}}>
                <deletedRoleContext.Provider value = {{deletedRole, setDeletedRole}}>
                <updatedRoleContext.Provider value = {{updatedRole, setUpdatedRole}}>
                <addedRoleContext.Provider value = {{addedRole, setAddedRole}}>

                  <div className = "section sectionMain sectionCenter">

                    <Route exact path = "/" component = {BaseCenter}/>

                    <Route path = "/groups">
                      <div className = "groupCenterArea">
                        <Route path = "/groups" component = {GroupExplorer}/>
                        <Route path = "/groups/:id" component = {GroupList}/>
                      </div>
                    </Route>

                    <Route path = "/users" component = {UserList}/>

                    <Route path = "/roles" component = {RoleList}/>

                    <Route path = "/logs" component = {ActivityList}/>

                  </div>

                  <div className = "section sectionMain sectionRight">

                    <Route exact path = "/" component = {BaseRight}/>

                    <Route path = "/groups/:id/group/:id" component = {GroupInfo}/>
                    <Route path = "/groups/:id/group/:id/edit" component = {GroupEdit}/>
                    <Route path = "/groups/:id/group/:id/move" component = {GroupMove}/>
                    <Route path = "/groups/:id/addgroup" component = {GroupAdd}/>
                    <Route path = "/groups/:id/addlock" component = {LockAdd}/>

                    <Switch>
                      <Route path = "/users/adduser" component = {UserAdd}/>
                      <Route path = "/users/:id" component = {UserInfo}/>
                    </Switch>
                    <Route path = "/users/:id/edit" component = {UserEdit}/>

                    <Switch>
                      <Route path = "/roles/addrole" component = {RoleAdd}/>
                      <Route path = "/roles/:id" component = {RoleInfo}/>
                    </Switch>
                    <Route path = "/roles/:id/edit" component = {RoleEdit}/>

                    <Route path = "/logs/:id" component = {ActivityInfo}></Route>

                  </div>

                </addedRoleContext.Provider>
                </updatedRoleContext.Provider>
                </deletedRoleContext.Provider>
                </addedLockContext.Provider>
                </updatedLockContext.Provider>
                </deletedLockContext.Provider>
                </addedGroupContext.Provider>
                </movedGroupContext.Provider>
                </updatedGroupContext.Provider>
                </deletedGroupsContext.Provider>
                </addedUserContext.Provider>
                </updatedUserContext.Provider>
                </deletedUserContext.Provider>
                </groupPathContext.Provider>
                </allRolesContext.Provider>
              </div>
            </>
          </Switch>
        </messageContext.Provider>
        </currentCentralContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
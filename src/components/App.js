import React, {useState, useEffect} from "react";
import api from "../services/api";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import "../global.css";
import "../css/app.css";

import BaseTop from "./base/BaseTop";
import BaseLeft from "./base/BaseLeft";
import BaseCenter from "./base/BaseCenter";
import BaseRight from "./base/BaseRight";

import UserAdd from "./user/UserAdd";
import UserList from "./user/UserList";
import UserInfo from "./user/UserInfo";
import UserEdit from "./user/UserEdit";
import UserSearchBar from "./user/UserSearchBar";
import UserSearch from "./user/UserSearch";

import GroupExplorer from "./group/GroupExplorer";
import GroupList from "./group/GroupList";
import GroupInfo from "./group/GroupInfo";
import GroupAdd from "./group/GroupAdd";
import GroupEdit from "./group/GroupEdit";
import LockAdd from "./group/LockAdd";

import RoleList from "./role/RoleList";
import RoleInfo from "./role/RoleInfo";
import RoleEdit from "./role/RoleEdit";
import RoleAdd from "./role/RoleAdd";
import RoleSearchBar from "./role/RoleSearchBar";
import RoleSearch from "./role/RoleSearch";

import allRolesContext from "./context/allRolesContext";
import groupPathContext from "./context/groupPathContext";
import deletedUserContext from "./context/deletedUserContext";
import updatedUserContext from "./context/updatedUserContext";
import addedUserContext from "./context/addedUserContext";
import deletedGroupsContext from "./context/deletedGroupsContext";
import updatedGroupContext from "./context/updatedGroupContext";
import addedGroupContext from "./context/addedGroupContext";
import deletedLockContext from "./context/deletedLockContext";
import updatedLockContext from "./context/updatedLockContext";
import addedLockContext from "./context/addedLockContext";
import deletedRoleContext from "./context/deletedRoleContext";
import updatedRoleContext from "./context/updatedRoleContext";
import addedRoleContext from "./context/addedRoleContext";


function App()
{
  const [allRoles, setAllRoles] = useState ([]);
  const [groupPath, setGroupPath] = useState ("");
  const [deletedUser, setDeletedUser] = useState ([]);
  const [updatedUser, setUpdatedUser] = useState ([]);
  const [addedUser, setAddedUser] = useState ([]);
  const [deletedGroups, setDeletedGroups] = useState ([]);
  const [updatedGroup, setUpdatedGroup] = useState ([]);
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
      const runEffect = async () =>
      {
        const response = await api.get
        (
          "/rolelist", {}
        );
        setAllRoles (response.data);
      }
      runEffect();
    },
    []
  )

  return (
    <BrowserRouter>
      <div id = "app">
        <div className = "section sectionTop">
          <Route path = "/" component = {BaseTop}/>
        </div>

        <div className = "Main">
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
          <addedGroupContext.Provider value = {{addedGroup, setAddedGroup}}>
          <deletedLockContext.Provider value = {{deletedLock, setDeletedLock}}>
          <updatedLockContext.Provider value = {{updatedLock, setUpdatedLock}}>
          <addedLockContext.Provider value = {{addedLock, setAddedLock}}>
          <deletedRoleContext.Provider value = {{deletedRole, setDeletedRole}}>
          <updatedRoleContext.Provider value = {{updatedRole, setUpdatedRole}}>
          <addedRoleContext.Provider value = {{addedRole, setAddedRole}}>

            <div className = "section sectionMain sectionCenter">

              <Route exact path = "/" component = {BaseCenter}/>

              <Route path = "/listusers" component = {UserSearchBar}/>
              <Route exact path = "/searchusers" component = {UserSearchBar}/>
              <Route path = "/searchusers/:name" component = {UserSearchBar}/>
              <Route path = "/listusers" component = {UserList}/>
              <Route path = "/searchusers/:name" component = {UserSearch}/>

              <Route path = "/groups">
                <div className = "groupCenterArea">
                  <Route path = "/groups" component = {GroupExplorer}/>
                  <Route path = "/groups/:id" component = {GroupList}/>
                </div>
              </Route>

              <Route path = "/listroles" component = {RoleSearchBar}/>
              <Route exact path = "/searchroles" component = {RoleSearchBar}/>
              <Route path = "/searchroles/:name" component = {RoleSearchBar}/>
              <Route path = "/listroles" component = {RoleList}/>
              <Route path = "/searchroles/:name" component = {RoleSearch}/>

            </div>

            <div className = "section sectionMain sectionRight">

              <Route exact path = "/" component = {BaseRight}/>

              <Switch>
                <Route path = "/listusers/adduser" component = {UserAdd}/>
                <Route path = "/listusers/:id" component = {UserInfo}/>
              </Switch>
              <Switch>
              <Route path = "/searchusers/:name/adduser" component = {UserAdd}/>
                <Route path = "/searchusers/:name/:id" component = {UserInfo}/>
              </Switch>
              <Route path = "/listusers/:id/edit" component = {UserEdit}/>
              <Route path = "/searchusers/:name/:id/edit" component = {UserEdit}/>

              <Route path = "/groups/:id/group/:id" component = {GroupInfo}/>
              <Route path = "/groups/:id/group/:id/edit" component = {GroupEdit}/>
              <Route path = "/groups/:id/addgroup" component = {GroupAdd}/>
              <Route path = "/groups/:id/addlock" component = {LockAdd}/>

              <Switch>
                <Route path = "/listroles/addrole" component = {RoleAdd}/>
                <Route path = "/listroles/:id" component = {RoleInfo}/>
              </Switch>
              <Switch>
                <Route path = "/searchroles/:name/addrole" component = {RoleAdd}/>
                <Route path = "/searchroles/:name/:id" component = {RoleInfo}/>
              </Switch>
              <Route path = "/listroles/:id/edit" component = {RoleEdit}/>
              <Route path = "/searchroles/:name/:id/edit" component = {RoleEdit}/>

            </div>

          </addedRoleContext.Provider>
          </updatedRoleContext.Provider>
          </deletedRoleContext.Provider>
          </addedLockContext.Provider>
          </updatedLockContext.Provider>
          </deletedLockContext.Provider>
          </addedGroupContext.Provider>
          </updatedGroupContext.Provider>
          </deletedGroupsContext.Provider>
          </addedUserContext.Provider>
          </updatedUserContext.Provider>
          </deletedUserContext.Provider>
          </groupPathContext.Provider>
          </allRolesContext.Provider>
        </div>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
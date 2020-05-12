import React, {useState} from "react";
import {BrowserRouter, Route} from "react-router-dom";

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

import deletedUserContext from "./context/deletedUserContext";
import updatedUserContext from "./context/updatedUserContext";
import groupPathContext from "./context/groupPathContext";
import deletedGroupsContext from "./context/deletedGroupsContext";
import updatedGroupContext from "./context/updatedGroupContext";
import addedGroupContext from "./context/addedGroupContext";
import deletedLockContext from "./context/deletedLockContext";
import updatedLockContext from "./context/updatedLockContext";
import addedLockContext from "./context/addedLockContext";


function App()
{
  const [deletedUser, setDeletedUser] = useState ([]);
  const [updatedUser, setUpdatedUser] = useState ([]);
  const [groupPath, setGroupPath] = useState ("");
  const [deletedGroups, setDeletedGroups] = useState ([]);
  const [updatedGroup, setUpdatedGroup] = useState ([]);
  const [addedGroup, setAddedGroup] = useState ([]);
  const [deletedLock, setDeletedLock] = useState ([]);
  const [updatedLock, setUpdatedLock] = useState ([]);
  const [addedLock, setAddedLock] = useState ([]);

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

          <updatedUserContext.Provider value = {{updatedUser, setUpdatedUser}}>
          <deletedUserContext.Provider value = {{deletedUser, setDeletedUser}}>
          <groupPathContext.Provider value = {{groupPath, setGroupPath}}>
          <deletedGroupsContext.Provider value = {{deletedGroups, setDeletedGroups}}>
          <updatedGroupContext.Provider value = {{updatedGroup, setUpdatedGroup}}>
          <addedGroupContext.Provider value = {{addedGroup, setAddedGroup}}>
          <deletedLockContext.Provider value = {{deletedLock, setDeletedLock}}>
          <updatedLockContext.Provider value = {{updatedLock, setUpdatedLock}}>
          <addedLockContext.Provider value = {{addedLock, setAddedLock}}>
            <div className = "section sectionMain sectionCenter">
              <Route exact path = "/" component = {BaseCenter}/>
              <Route path = "/listusers" component = {UserSearchBar}/>
              <Route path = "/searchusers" component = {UserSearchBar}/>
              <Route path = "/listusers" component = {UserList}/>
              <Route path = "/searchusers/:name" component = {UserSearch}/>
              <div className = "groupCenterArea">
                  <Route path = "/groups" component = {GroupExplorer}/>
                  <Route path = "/groups/:id" component = {GroupList}/>
              </div>
            </div>

            <div className = "section sectionMain sectionRight">
              <Route exact path = "/" component = {BaseRight}/>
              <Route path = "/adduser" component = {UserAdd}/>
              <Route path = "/listusers/:id" component = {UserInfo}/>
              <Route path = "/searchusers/:name/:id" component = {UserInfo}/>
              <Route path = "/listusers/:id/edit" component = {UserEdit}/>
              <Route path = "/searchusers/:name/:id/edit" component = {UserEdit}/>
              <Route path = "/groups/:id/group/:id" component = {GroupInfo}/>
              <Route path = "/groups/:id/group/:id/edit" component = {GroupEdit}/>
              <Route path = "/groups/:id/addgroup" component = {GroupAdd}/>
              <Route path = "/groups/:id/addlock" component = {LockAdd}/>
            </div>
          </addedLockContext.Provider>
          </updatedLockContext.Provider>
          </deletedLockContext.Provider>
          </addedGroupContext.Provider>
          </updatedGroupContext.Provider>
          </deletedGroupsContext.Provider>
          </groupPathContext.Provider>
          </deletedUserContext.Provider>
          </updatedUserContext.Provider>
        </div>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
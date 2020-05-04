import React, {useState} from "react";
import {BrowserRouter, Route} from "react-router-dom";
import deletedUserContext from "./context/deletedUserContext";

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

function App()
{
  const [deletedUser, setDeletedUser] = useState ([]);

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

          <deletedUserContext.Provider value = {{deletedUser, setDeletedUser}}>
            <div className = "section sectionMain sectionCenter">
              <Route exact path = "/" component = {BaseCenter}/>
              <Route path = "/listusers" component = {UserSearchBar}/>
              <Route path = "/searchusers" component = {UserSearchBar}/>
              <Route path = "/listusers" component = {UserList}/>
              <Route path = "/searchusers/:name" component = {UserSearch}/>
            </div>

            <div className = "section sectionMain sectionRight">
              <Route exact path = "/" component = {BaseRight}/>
              <Route path = "/adduser" component = {UserAdd}/>
              <Route path = "/listusers/:id" component = {UserInfo}/>
              <Route path = "/searchusers/:name/:id" component = {UserInfo}/>
              <Route path = "/listusers/:id/edit" component = {UserEdit}/>
              <Route path = "/searchusers/:name/:id/edit" component = {UserEdit}/>
            </div>
          </deletedUserContext.Provider>
        </div>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
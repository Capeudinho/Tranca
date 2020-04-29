import React from "react";
import api from "../services/api";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import "../global.css";

import BaseTop from "./base/BaseTop";
import BaseLeft from "./base/BaseLeft";
import BaseCenter from "./base/BaseCenter";
import BaseRight from "./base/BaseRight";

import UserAdd from "./user/UserAdd";
import UserList from "./user/UserList";
import UserInfo from "./user/UserInfo";

function App() {
  return (
    <BrowserRouter>
      <div id = "app">
        <div className = "section sectionTop">
          <BaseTop/>
        </div>
        <div className = "section sectionLeft">
          <BaseLeft/>
        </div>
        <div className = "section sectionCenter">
          <Route path = "/" exact component = {BaseCenter}/>
          <Route path = "/adduser" component = {UserAdd}/>
          <Route path = "/listusers" component = {UserList}/>
        </div>
        <div className = "section sectionRight">
          <Route path = "/" exact component = {BaseRight}/>
          <Route path = "/listusers/:id" component = {UserInfo}/>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
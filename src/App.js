import React from "react";
import api from "./services/api";
import "./global.css";
import "./App.css"

import UserAdd from "./components/UserAdd";

function App() {
  return (
    <div id = "app">
      <header className = "header">
        <div className = "profilePicture"></div>
        <div className = "profileName">Rafael Carvalho</div>
        <div className = "search">Pesquisar</div>
        <div className = "menu">Menu</div>
      </header>
      <div className = "main">
        <div className = "section sectionLeft">
          <div className = "area areaRecents">
            <div className = "list listRecents">
              <button className = "fileButton">
                Recentes
              </button>
            </div>
          </div>
          <div className = "area areaLocks">
            <div className = "list listLocks">
              <button  className = "fileButton">
                Trancas
              </button>
              <div className = "explorer">
                <div className = "item itemLeft itemComponent">
                  <button className = "arrow">></button>
                  <button className = "name">Bloco E</button>
                </div>
                <div className = "item itemLeft itemComponent">
                  <button className = "arrow">></button>
                  <button className = "name">Bloco D</button>
                </div>
                <div className = "item itemLeft itemComponent">
                  <button className = "arrow">></button>
                  <button className = "name">Bloco C</button>
                </div>
              </div>
            </div>
          </div>
          <div className = "area areaUsers">
            <div className = "list listUsers">
              <button className = "fileButton">
                Usuários
              </button>
              <div className = "explorer">
                <div className = "item itemLeft itemUser">
                  <button className = "name">Maria Clara</button>
                </div>
                <div className = "item itemLeft itemUser">
                  <button className = "name">João Paulo</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className = "section sectionCenter">
          <UserAdd></UserAdd>
        </div>

        <div className = "section sectionRight">
            <p className = "name">Lab 12</p>
            <p className = "type">Sala</p>
          <div>
            <button className = "buttonAction buttonEdit">Editar</button>
            <button className = "buttonAction buttonMove">Mover</button>
            <button className = "buttonAction buttonExclude">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
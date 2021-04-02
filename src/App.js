import './App.css';
import MainPage from "./components/MainPage"
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './login';
import React from "react";

function App() {
  return (
      <div className="App">
          <BrowserRouter>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/mainpage">
              <MainPage />
            </Route>
          </Switch>
          </BrowserRouter>
      </div>
  );
}

export default App;

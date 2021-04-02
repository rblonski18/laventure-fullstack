import './App.css';
import MainPage from "./components/MainPage";
import NewAccount from "./newaccount";
import Login from './login';

import React from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom';

function App() {
  return (
      <div className="App">
          <BrowserRouter>
              <Switch>
                  <Route path="/login" component={Login}/>
                  <Route path="/mainpage" component={MainPage}/>
                  <Route path="/newaccount" component={NewAccount}/>
              </Switch>
          </BrowserRouter>
      </div>
  );
}

export default App;

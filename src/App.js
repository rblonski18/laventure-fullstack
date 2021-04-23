import './App.css';
import NewAccount from "./NewAccount";
import MainPage from "./components/MainPage"
import Login from './Login';
import NewActivity from "./NewActivity";
import ActivityPage from "./components/ActivityPage"

import React from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom';

function error() {
    return (
        <div>
            <h1>404 Page Not Found</h1>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/mainpage" component={MainPage}/>
                    <Route exact path="/newaccount" component={NewAccount}/>
                    <Route exact path="/newactivity" component={NewActivity}/>
                    <Route exact path="/activity/:activityID" component={ActivityPage}/>
                    <Route component={error}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;

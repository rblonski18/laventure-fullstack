import './App.css';
import MainPage from "./components/MainPage"

import Login from './login';
import React from "react";

function App() {
  return (
      <div className="App">
          <MainPage />
          <Login/>
      </div>
  );
}

export default App;

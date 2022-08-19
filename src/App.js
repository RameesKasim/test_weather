import "./App.css";
import { React, useEffect } from "react";
import Home from "./components/home";

let App = () => {
  useEffect(() => {});
  return (
    <div className="App">
      <header className="App-header">
        <Home />
      </header>
    </div>
  );
};

export default App;

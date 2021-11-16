import './App.css';
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes/Routes";
import Axios from "axios";
import "../../resources/css/app.css";

class App extends Component {
  state = {};

  render() {
    return <Routes />;
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

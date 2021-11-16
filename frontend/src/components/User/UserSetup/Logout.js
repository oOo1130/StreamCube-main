import React, { Component } from "react";
import Axios from "axios";

class Logout extends Component {
  state = {};

  componentDidMount = () => {
    const token = localStorage.getItem("token");
    Axios.post(
      "http://localhost:8000/api/auth/logout?",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token
        }
      }
    )
      .then(() => {
        this.logout();
      })
      .catch(() => {
        this.logout();
      });
  };

  logout = () => {
    this.props.logout_url_update();
    localStorage.removeItem("token");
    this.props.history.push("/");
  };

  render() {
    return <React.Fragment></React.Fragment>;
  }
}

export default Logout;

import React, { Component } from "react";
import Axios from "axios";
import Consumer from "./Consumer_Account";
import Business from "./Business_Account";
import Balance from "./Balance";

class Account extends Component {
  state = {
    is_consumer: ""
  };

  componentDidMount = () => {
    let token = localStorage.getItem("token");
    Axios.get("http://localhost:8000/api/auth/user", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + token
      }
    }).then(response => {
      this.setState({ is_consumer: response.data.is_consumer });
    });
  };

  account_class = () => {
    if (this.state.is_consumer) {
      return (
        <React.Fragment>
          <Consumer />
          <Balance />
        </React.Fragment>
      );
    } else if (this.state.is_consumer === false) {
      return <Business />;
    }
  };

  render() {
    return <React.Fragment>{this.account_class()}</React.Fragment>;
  }
}

export default Account;

import React, { Component } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Account from "../Account/Account";
import "react-toastify/dist/ReactToastify.css";

class Balance extends Component {
  state = {
    balance: 0,
  };

  withdraw_payment = () => {
    let email = document.getElementById("paypal_email").value;
    let token = localStorage.getItem("token");
    if (email === null) {
    } else {
      console.log("success");
      toast.success("clicked");
      Axios.post(
        "http://localhost:8000/api/auth/payment",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "token " + token,
          },
        }
      )
        .then((response) => {
          let message = response.data.msg;
          if (message) {
            toast.success("Money has been withdrawn sucessfully");
            // document
            //   .getElementById("withdraw")
            //   .setAttribute("disabled", "disabled");
            this.setState({ balance: 0 });
          } else {
            console.log("test");
            toast.error("Whoops something went, wrong try again later");
          }
        })
        .catch((err) => {
          toast.error("Error getting balance, try again later");
        });
    }
  };

  componentDidMount = () => {
    let token = localStorage.getItem("token");
    Axios.post(
      "http://localhost:8000/api/getBalance",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token,
        },
      }
    )
      .then((response) => {
        let { balance } = response.data;
        document
          .getElementById("withdraw")
          .setAttribute("disabled", "disabled");
        if (balance >= 5) {
          document
            .getElementById("withdraw")
            .removeAttribute("disabled", "disabled");
        }
        this.setState({ balance });
      })
      .catch((err) => {
        toast.error("Error getting balance, try again later");
      });
  };

  render() {
    const { balance } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <ToastContainer />
          <h1 className="h2">Balance: {balance}</h1>
          <div className="btn-toolbar mb-2 mb-md-0"></div>
        </div>
        <div className="container">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Paypal Email address</label>
            <input
              id="paypal_email"
              className="form-control"
              type="email"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
            <small id="emailHelp" className="form-text text-muted">
              Incorrect paypal email will result in failure, so ensure correct,
              otherwise you hold responsibility.
            </small>
          </div>

          <button
            onClick={this.withdraw_payment}
            id="withdraw"
            className="btn btn-primary"
          >
            Withdraw
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Balance;

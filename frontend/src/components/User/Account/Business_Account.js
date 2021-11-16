import React, { Component } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Business_Account extends Component {
  state = {
    username: "Username",
    password: "*********",
    email: "email@email.com",
    company_name: "company_name",
  };

  componentDidMount = () => {
    this.load_user_data();
  };

  validate = (username, password, email) => {
    const username_regex = new RegExp(
      "^(?=[a-zA-Z0-9]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$"
    );
    const password_regex = new RegExp("(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}");
    const email_regex = new RegExp(
      "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
    );
    // console.log(password);

    let passwordValidation = password_regex.test(password);
    let usernameValidation = username_regex.test(username);
    let email_validation = email_regex.test(email);

    let username_error =
      "username must be within 8-20 characters long and cannot contain invalid values such as _* etc";

    let password_error =
      "Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters";

    let email_error = "Email is invalid";

    if (!usernameValidation) {
      toast.error(username_error);
      return false;
    }

    if (!email_validation) {
      toast.error(email_error);
      return false;
    }

    if (!passwordValidation & (password !== null)) {
      toast.error(password_error);
      return false;
    }
    return true;
  };

  load_user_data = () => {
    let token = localStorage.getItem("token");
    Axios.get("http://localhost:8000/api/auth/businessProfile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + token,
      },
    }).then((response) => {
      let response_data = response.data;

      let username = response_data.username;
      let email = response_data.email;
      let company_name = response_data.company_name;

      this.setState({ company_name, username, email });
    });
  };

  on_save = () => {
    let username =
      document.getElementById("username").value === ""
        ? this.state.username
        : document.getElementById("username").value;

    let password =
      document.getElementById("password").value === ""
        ? null
        : document.getElementById("password").value;

    let email =
      document.getElementById("email").value === ""
        ? this.state.email
        : document.getElementById("email").value;

    if (!this.validate(username, password, email)) {
      return false;
    }
    Axios.post("http://localhost:8000/api/auth/updateBusiness", {
      prev_username: this.state.username,
      username: username,
      password: password,
      email: email,
    })

    
      .then((response) => {
        if (response.data.msg === "Success") {
          console.log(response.data.msg);
          toast.success("Success");
        } else {
          toast.error(response.data.msg);
        }

        this.load_user_data();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  edit_details = () => {
    document.getElementById("username").disabled = false;
    document.getElementById("password").disabled = false;
    document.getElementById("email").disabled = false;
    document.getElementById("save_button").disabled = false;
  };

  render() {
    const { username, password, email, company_name } = this.state;
    return (
      <div>
        <ToastContainer />
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Account</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group mr-2">
              <button
                onClick={this.edit_details}
                className="btn btn-sm btn-outline-secondary"
              >
                Edit
              </button>
              <button
                onClick={this.on_save}
                id="save_button"
                className="btn btn-sm btn-outline-secondary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="form-row mb-4">
            <div className="col">
              <input
                disabled
                type="text"
                id="username"
                className="form-control"
                placeholder={username}
              />
            </div>
            <div className="col">
              <input
                type="password"
                disabled
                id="password"
                className="form-control"
                placeholder={password}
              />
            </div>
          </div>
          <div className="form-row mb-4">
            <div className="col">
              <input
                type="email"
                disabled
                id="email"
                className="form-control"
                placeholder={email}
              />
            </div>
          </div>

          <div className="form-row mb-4">
            <div className="col">
              <input
                type="text"
                disabled
                id="company_name"
                className="form-control"
                placeholder={company_name}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Business_Account;

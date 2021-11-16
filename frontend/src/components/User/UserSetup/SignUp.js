import React, { Component } from "react";
import ConsumerLogin from "./Consumer_signup";
import BusinessLogin from "./Business_SignUp";
import Axios from "axios";
import "../../../../resources/css/register.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../Navbar";

class SignUp extends Component {
  state = {
    ButtonState: true,
    interests: ["Technology", "Sports", "Health", "Diy","Gaming","Music","Books","Art","Science","Architecture","Business","History","Finance","Biology","Languages"],
  };

  validate_signup = () => {
    let password = document.getElementById("password").value;
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;

    const username_regex = new RegExp(
      "^(?=[a-zA-Z0-9]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$"
    );
    const password_regex = new RegExp("(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}");
    const email_regex = new RegExp(
      "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
    );

    let passwordValidation = password_regex.test(password);
    let usernameValidation = username_regex.test(username);
    let email_validation = email_regex.test(email);

    let username_error =
      "username must be within 8-20 characters long and cannot contain invalid values such as _* etc";

    let password_error =
      "Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters";

    let email_error = "Email is invalid";

    console.log(usernameValidation);

    if (!usernameValidation) {
      toast.error(username_error);
      return false;
    }

    if (!email_validation) {
      toast.error(email_error);
      return false;
    }

    if (!passwordValidation) {
      toast.error(password_error);
      return false;
    }
    return true;
  };

  SignUpRequest = (additional) => {
    if (!this.validate_signup()) {
      return false;
    }

    Axios.post("http://localhost:8000/api/auth/register", {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      email: document.getElementById("email").value,
      is_consumer: this.state.ButtonState ? "True" : "false",
      additional,
    })
      .then((response) => {
        setTimeout(function () {
          toast.success("Account made");
        }, 2000);
        // toast.success("Account made");
        this.props.history.push("/login");
      })
      .catch((err) => {
        toast.error(
          "Failed to create account, ensure your details are correct or report this"
        );
      });
  };

  updateForm = () => {
    let slider = this.state.ButtonState;

    if (slider) {
      this.setState({ ButtonState: false });
    } else {
      this.setState({ ButtonState: true });
    }
  };

  render() {
    return (
      <div className="ui-container">
        <Navbar />
        <ToastContainer />
        <form className="form">
          <label htmlFor="email">Username</label>
          <input
            type="username"
            placeholder="Username"
            className="form-control"
            id="username"
          />

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              placeholder="Email@email.com"
              className="form-control"
              id="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
            />
          </div>

          <div className="custom-control custom-switch">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customSwitch1"
            />
            <label
              id="consumer_business_switch"
              className="custom-control-label"
              onClick={() => this.updateForm()}
              htmlFor="customSwitch1"
            >
              Consumer/Business
            </label>
          </div>

          {this.state.ButtonState && (
            <ConsumerLogin
              signup={this.SignUpRequest}
              interests={this.state.interests}
            />
          )}
          {!this.state.ButtonState && (
            <BusinessLogin
              signup={this.SignUpRequest}
              interests={this.state.interests}
            />
          )}

          <div className="col-12 mt-2">
            By Clicking Signup you automatically agree to our <a href="#TermsConditions" title="Terms &amp; Conditions">Terms &amp; Conditions</a> and to our <a href="#PrivacyPolicy" title="Privacy Policy">Privacy Policy</a>
          </div>
        </form>
      </div>
    );
  }
}

export default SignUp;
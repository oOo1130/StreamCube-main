import React, { Component } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Consumer_Account extends Component {
  state = {
    interests: [
      { title: "Technology", active: "" },
      { title: "Sports", active: "" },
      { title: "Health", active: "" },
      { title: "DIY", active: "" },
      { title: "Gaming", active: "" },
      { title: "Music", active: "" },
      { title: "Books", active: "" },
      { title: "Art", active: "" },
      { title: "Science", active: "" },
      { title: "Architecture", active: "" },
      { title: "Business", active: "" },
      { title: "History", active: "" },
      { title: "Finance", active: "" },
      { title: "Biology", active: "" },
      { title: "Languages", active: "" },
    ],
    genders: [
      { title: "Male", active: "" },
      { title: "Female", active: "" },
      { title: "Other", active: "" },
    ],
    username: "Username",
    password: "*********",
    email: "email@email.com",
    age: "0",
    dob: "",
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
    console.log(password);

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
    Axios.get("http://localhost:8000/api/auth/consumerList", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + token,
      },
    }).then((response) => {
      let { genders, interests } = this.state;
      let response_data = response.data;

      let username = response_data.Username;
      let email = response_data.Email;
      let age = response_data.Age;
      let dob = response_data.DOB;
      let gender_active = response_data.Gender;

      for (const [key, value] of Object.entries(genders)) {
        if (value.title === gender_active) {
          genders[key].active = "selected";
        }
      }

      for (const [key1, value1] of Object.entries(interests)) {
        for (const [key2, value2] of Object.entries(response_data.Interests)) {
          if (value1.title === value2) {
            interests[key1].active = "selected";
          }
        }
      }
      this.setState({ genders, interests, username, email, age, dob });
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

    let age =
      document.getElementById("age").value === ""
        ? this.state.age
        : document.getElementById("age").value;

    let gender = document.getElementById("gender").value;

    let e = document.getElementById("interests_options");
    let interests = [];
    for (let i in this.state.interests) {
      let index = this.state.interests[i];
      if (e.options[i].selected) {
        interests.push(index.title);
      }
    }

    if (interests.length <= 0) {
      toast.error("No interests selected");
      return false;
    }

    if (!this.validate(username, password, email)) {
      return false;
    }

    Axios.post("http://localhost:8000/api/auth/updateConsumer", {
      prev_username: this.state.username,
      username: username,
      password: password,
      email: email,
      age: age,
      interests: interests,
      gender,
    })
      .then((response) => {
        if (response.data.msg === "Success") {
          toast.success(response.data.msg);
        } else {
          toast.error(response.data.msg);
        }
        this.load_user_data();
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(username, email, interests);
  };

  edit_details = () => {
    document.getElementById("username").disabled = false;
    document.getElementById("password").disabled = false;
    document.getElementById("email").disabled = false;
    document.getElementById("age").disabled = false;
    document.getElementById("gender").disabled = false;
    document.getElementById("interests_options").disabled = false;
    document.getElementById("save_button").disabled = false;
  };

  render() {
    const { username, password, email, age, dob } = this.state;
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
                id="age"
                className="form-control"
                placeholder={age}
              />
            </div>
            <div className="col">
              <input
                type="text"
                disabled
                id="dob"
                className="form-control"
                placeholder={dob}
              />
            </div>
            <div className="col">
              <select disabled className="form-control" id="gender">
                {this.state.genders.map((gender) => (
                  <option key={gender.title} selected={gender.active}>
                    {gender.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <select
            disabled
            multiple
            className="form-control"
            id="interests_options"
          >
            {this.state.interests.map((interest) => (
              <option selected={interest.active} key={interest.title}>
                {interest.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default Consumer_Account;

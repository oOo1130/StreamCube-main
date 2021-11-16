import React, { Component } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import "../../../../resources/css/login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../Navbar";

class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  onSubmit = () => {
    Axios.post("http://localhost:8000/api/auth/login?", {
      username: this.state.username[0],
      password: this.state.password[0],
    })
      .then((response) => {
        let return_data = response.data;
        let account_type = return_data.user.is_consumer;

        this.props.login_url_update(account_type);
        localStorage.setItem("token", return_data.token);
        this.props.history.push("/");
      })
      .catch((err) => {
        toast.error("Username and/or password are incorrect");
      });
  };

  onChange = (e) => this.setState({ [e.target.name]: [e.target.value] });

  render() {
    const { username, password } = this.state;

    return (
      <div className="ui-container">
        <ToastContainer />
        <Navbar />
        <div className="form">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Username</label>
            <input
              type="username"
              className="form-control"
              placeholder="Username"
              onChange={this.onChange}
              name="username"
              value={username}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={this.onChange}
              name="password"
              value={password}
            />
          </div>

          <button
            type="submit"
            onClick={() => this.onSubmit()}
            className="btn btn-primary btn-dark"
          >
            Submit
          </button>
          <p>
            Don't have an account, <Link to="/SignUp">Register Now</Link>{" "}
          </p>
        </div>
      </div>
    );
  }
}

export default Login;

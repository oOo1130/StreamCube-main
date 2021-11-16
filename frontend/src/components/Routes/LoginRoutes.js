//Library imports
import React, { Component } from "react";
import Axios from "axios";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

//Component imports
import LayoutManager from "../layout/LayoutManger";
import Login from "../User/UserSetup/Login";
import Logout from "../User/UserSetup/Logout";
import SignUp from "../User/UserSetup/SignUp";
import LogRoutes from "../Route/LogRoutes";
import Footer from "../layout/Footer";
import { bool } from "prop-types";

class LoginState extends Component {
  state = {
    left_links: [],
    right_links: [],
    boolean: false,
  };

  // Urls for navbars assigned here
  default_navigation_urls = [
    {
      title: "Home",
      link: "#/",
    },
  ];

  default_account_urls = [
    {
      title: "Login",
      link: "#/login",
    },
  ];

  account_urls = [
    {
      title: "My Profile",
      link: "#/account",
    },
    {
      title: "logout",
      link: "#/logout",
    },
  ];

  navigation_urls_consumer = [
    {
      title: "Videos",
      link: "#/consumervideos",
    },
  ];

  navigation_urls_business = [
    {
      title: "Videos",
      link: "#/video",
    },
    {
      title: "New Video",
      link: "#/upload",
    },
  ];

  /**
   * Function changes the navbar urls according to
   * correct user account
   */
  login_url_update = (is_consumer) => {
    if (typeof is_consumer !== "undefined") {
      this.props.update_type(is_consumer);
    }
    const user_type = this.props.type;
    if (user_type) {
      this.setState({
        left_links: this.navigation_urls_consumer,
      });
    } else {
      this.setState({
        left_links: this.navigation_urls_business,
      });
    }
    this.setState({ right_links: this.account_urls });
  };

  /**
   * Function changes the navbar urls to default urls
   */
  logout_url_update = () => {
    this.setState({
      left_links: this.default_navigation_urls,
      right_links: this.default_account_urls,
    });
    this.props.update_type("");
  };

  /**
   * Function sets the type of user account
   */
  get_type = () => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      Axios.get("http://localhost:8000/api/auth/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token,
        },
      })
        .then((response) => {
          this.props.update_type(response.data.is_consumer);
          this.login_url_update();
          // we added here!!
          this.setState({
            boolean: true,
          });
        })
        .catch((err) => {
          this.props.update_type("");
          localStorage.removeItem("token");
          this.logout_url_update();
        });
    }
  };

  /**
   * Function sets the navbar urls in case user
   * refreshes page
   */
  componentDidMount = () => {
    if (localStorage.getItem("token") != null) {
      this.get_type();
    } else {
      this.state.boolean = false;
      localStorage.removeItem("token");
      this.logout_url_update();
      this.props.update_type("");
    }
  };

  render() {
    return (
      <React.Fragment>
        {/* we added here!!*/}
        <LayoutManager
          left_links={this.state.left_links}
          right_links={this.state.right_links}
          type={this.props.type}
        />
        {console.log("type "+this.props.type)}
        <HashRouter>
          <Route
            exact
            path="/logout"
            render={(props) => (
              <Logout {...props} logout_url_update={this.logout_url_update} />
            )}
          ></Route>
          <LogRoutes exact path="/SignUp" component={SignUp} />
          <LogRoutes
            exact
            path="/login"
            component={Login}
            login_url_update={this.login_url_update}
          />
        </HashRouter>
      </React.Fragment>
    );
  }
}

export default LoginState;

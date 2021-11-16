import React, { Component } from "react";
import Axios from "axios";
// import Footer from '../layout/Footer';
// import Header from '../layout/Header';
// import Home from '../pages/HomePage/Home';
import Businesses from "../pages/BusinessesPage/Businesses";
import Footer from "../pages/Footer/Footer";
import Navbar from "../Navbar";

class Business extends Component {
  state = {};

  redirect = () => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      Axios.get("http://localhost:8000/api/auth/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token,
        },
      }).then((response) => {
        if (response.data.is_consumer) {
          this.props.history.push("/consumervideos");
        } else {
          this.props.history.push("/video");
        }
      });
    }
  };

  render() {
    return (
      <div className="ui-container">
        {this.redirect()}
        <Navbar />
        <Businesses />
        <Footer />
      </div>
    );
  }
}

export default Business;

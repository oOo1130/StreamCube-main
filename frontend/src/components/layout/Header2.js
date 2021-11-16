import React, { Component, useState, useEffect } from "react";
import Axios from "axios";
import logo from "../../../resources/img/logo.png";
import "../../../resources/css/navbar.css";
// import { FaBars, FaTimes } from "react-icons/fa";
// import { Button } from "./Button";
// import { IconContext } from "react-icons/lib";
import { Link } from "react-router-dom";
import { MdFingerprint } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import { Button } from "../Button";
import "../Navbar.css";
import { IconContext } from "react-icons/lib";

/**
 * Navigation component
 * Returns the navigation bar of the page
 */
class Header extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <IconContext.Provider value={{ color: "#fff" }}>
          <nav className="navbar navbar-light navbar-expand-lg">
            <a className="navbar-brand" href="/">
              <img src={logo} className="img-responsive" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <a className="nav-links" href="/users">
                    Users
                  </a>
                </li>
                {this.props.left_link.map((linkage) => {
                  return (
                    <li key={linkage.title} className="nav-item">
                      <a className="nav-link" href={linkage.link}>
                        {linkage.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div
                className="form-inline my-2 my-lg-0"
                id="navbarSupportedContent2"
              >
                <div className="btn-group mr-2">
                  {this.props.right_link.map((linkage) => {
                    return (
                      <button
                        type="button"
                        key={linkage.title}
                        className="btn btn-sm btn-outline-secondary"
                        href={linkage.link}
                      >
                        <a href={linkage.link}>{linkage.title}</a>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>
        </IconContext.Provider>
      </React.Fragment>
    );
  }
}

export default Header;

import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import Launch from "../Launchpad/Launch";
import LoginRoutes from "./LoginRoutes";
import Settings from "../User/Account/Settings";
import AuthRoute from "../Route/AuthRoute";
import BusinessRoute from "../Route/BusinessRoute";
import ConsumerRoute from "../Route/ConsumerRoute";
import SignUp from "../User/UserSetup/SignUp";
import Login from "../User/UserSetup/Login";

import Users from "../Launchpad/Users";
import AboutUs from "../Launchpad/AboutUs";
import TermsConditions from "../Launchpad/TermsConditions";
import PrivacyPolicy from "../Launchpad/PrivacyPolicy";

import Business from "../Launchpad/Business";
import Video from "../Business/Video";
import Upload from "../Business/Upload";
import Report from "../Business/Report";
import Edit from "../Business/Edit";
import ConsumerVideos from "../Consumer/ConsumerVideos";
import AdvertStream from "../Consumer/Video";

class Routes extends Component {
  state = { type: "" };

  update_type = (value) => {
    this.setState(
      { type: value },
      console.log("hon value " + value + " type " + this.state.type)
    );
  };

  render() {
    return (
      <React.Fragment>
        <LoginRoutes
          type={this.state.type}
          update_type={this.update_type}
          type={this.state.type}
        />
        <HashRouter>
          <Switch>
            <ConsumerRoute
              exact
              path="/consumervideos"
              component={ConsumerVideos}
              type={this.state.type}
            />
            <ConsumerRoute
              exact
              path="/advertstream"
              component={AdvertStream}
              type={this.state.type}
            />

            <Route
              exact
              path="/"
              component={Launch}
              type={this.state.type}
            ></Route>
            <Route
              exact
              path="/Businesses"
              component={Business}
              type={this.state.type}
            ></Route>
            <Route
              exact
              path="/Users"
              component={Users}
              type={this.state.type}
            ></Route>
            <Route
              exact
              path="/AboutUs"
              component={AboutUs}
              type={this.state.type}
            ></Route>
            <Route
              exact
              path="/TermsConditions"
              component={TermsConditions}
              type={this.state.type}
            ></Route>            
            <Route
              exact
              path="/PrivacyPolicy"
              component={PrivacyPolicy}
              type={this.state.type}
            ></Route>            
            {/* <Route
              exact
              path="/login"
              component={Login}
              type={this.state.type}
            ></Route> */}
            {/* /Consumer_SignUp */}
            {/* <Route
              exact
              path="/SignUp"
              component={SignUp}
              type={this.state.type}
            ></Route> */}
            <Route
              exact
              path="/Consumer_SignUp"
              component={SignUp}
              type={this.state.type}
            ></Route>
            <BusinessRoute exact path="/report" component={Report} />
            <BusinessRoute exact path="/edit" component={Edit} />
            {/*  */}
            <BusinessRoute
              exact
              path="/User"
              component={Users}
              type={this.state.type}
            ></BusinessRoute>
            {/*  */}
            <BusinessRoute
              exact
              path="/video"
              component={Video}
              type={this.state.type}
            />
            <AuthRoute
              exact
              path="/account"
              component={Settings}
              type={this.state.type}
            />

            <BusinessRoute
              exact
              path="/upload"
              component={Upload}
              type={this.state.type}
            />
          </Switch>
        </HashRouter>
      </React.Fragment>
    );
  }
}

export default Routes;

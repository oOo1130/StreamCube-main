import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

const LogRoutes = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("token") != null ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} {...rest} />
        )
      }
    />
  );
};

export default LogRoutes;

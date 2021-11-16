import React, { Component } from "react";
import Header from "./Header";
import Headerr from "./Header2";
import Footer from "./Footer";
import Navbar from "../Navbar";

class LayoutManager extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        {/* localStorage.getItem("token") != null  */}
        {this.props.type === false || this.props.type === true ? (
          <Header
            update_right={this.props.update_right}
            update_left={this.props.update_left}
            left_link={this.props.left_links}
            right_link={this.props.right_links}
          />
        ) : null}
        {/* <Headerr
          update_right={this.props.update_right}
          update_left={this.props.update_left}
          left_link={this.props.left_links}
          right_link={this.props.right_links}
        /> */}
        {/* <Footer />  */}
      </React.Fragment>
    );
  }
}

export default LayoutManager;

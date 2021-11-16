import React, { Component } from "react";

/**
 * Sub component of Survey Builder which builds
 * a text form for questions.
 */
class Text extends Component {
  state = {};

  render() {
    return (
      <div>
        <input
          type="text"
          className="form-control"
          id={"question_" + this.props.count}
          placeholder="Question?"
        ></input>
      </div>
    );
  }
}

export default Text;

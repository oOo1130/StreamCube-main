import React, { Component } from "react";

class TextQuestion extends Component {
  state = {
    question: ""
  };

  componentDidMount = () => {
    let { question } = this.state;
    question = this.props.question;

    this.setState({ question });
  };

  change_handler = () => {
    let answer = document.getElementById("text_answers_" + this.props.index)
      .value;
    this.props.update_answers(this.state.question, answer);
  };

  render() {
    let { question } = this.state;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor="exampleFormControlInput1">{question}</label>
          <input
            type="text"
            className="form-control"
            id={"text_answers_" + this.props.index}
            onChange={this.change_handler}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default TextQuestion;

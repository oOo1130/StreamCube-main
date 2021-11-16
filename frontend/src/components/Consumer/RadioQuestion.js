import React, { Component } from "react";
import "../../../resources/css/survey.css";

class RadioQuestion extends Component {
  state = {
    question: "",
    options: []
  };

  componentDidMount = () => {
    let { question, options } = this.state;
    const { choices } = this.props;
    question = this.props.question;
   
    for (const [key, value] of Object.entries(choices)) {
      options.push(value.choice);
    }

    this.setState({ question, options });
  };

  change_handler = e => {
    this.props.update_answers(this.state.question, e.target.value);
  };

  render() {
    let { question } = this.state;
    return (
      <React.Fragment>
        <label htmlFor="staticEmail" className="">
          {question}
        </label>
        {this.state.options.map( (option,x) => (
          <div key={option+x} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id={"radio_answer_" + this.props.index + x}
              value={option}
              onClick={e => this.change_handler(e)}
            />
            <label className="form-control" htmlFor={"radio_answer_" + this.props.index + x}>
              {option}
            </label>
          </div>
        ))}
      </React.Fragment>
    );
  }
}

export default RadioQuestion;

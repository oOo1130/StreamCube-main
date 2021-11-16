import React, { Component } from "react";

/**
 * Sub component of SurveyBuilder, which builds a radio form
 */
class Radio extends Component {
  state = {
    optionNo: 2,
    options: [
      { id: 1, pl: "Option 1" },
      { id: 2, pl: "Option 2" }
    ]
  };

  /**
   * Method creates another option form
   */
  add_option = () => {
    let { options, optionNo } = this.state;
    let index = optionNo + 1;
    if (index < 5) {
      options.push({ id: ++optionNo, pl: "Option " + optionNo });
      this.setState({ options, optionNo });
    }
  };

  /**
   * Method removes an existing option form
   */
  remove_option = () => {
    let { options, optionNo } = this.state;
    let index = optionNo - 1;
    if (index > 1) {
      options.pop();
      this.setState({ options, optionNo: index });
      this.data_handler(index);
    }
  };

  /**
   * Method is used to update the main survey data structure
   * which stores all questions/options.
   */
  data_handler = optionNo => {
    let json = {};
    for (let i = 1; i <= optionNo; i++) {
      json["option" + i] = document.getElementById(
        "option" + this.props.count + i
      ).value;
    }
    let question = document.getElementById("question_" + this.props.count)
      .value;
    this.props.update_data(this.props.count, json, question);
  };

  render() {
    return (
      <div>
        <input
          type="text"
          className="form-control"
          id={"question_" + this.props.count}
          placeholder="Question?"
        ></input>
        {this.state.options.map(option => (
          <input
            key={option.id}
            type="text"
            className="form-control"
            onChange={() => this.data_handler(this.state.optionNo)}
            id={"option" + this.props.count + option.id}
            placeholder={option.pl}
          ></input>
        ))}
        <div className="form-row mb-4">
          <div className="col">
            <button
              onClick={this.remove_option}
              className="btn btn-success btn-circle btn-lg"
            >
              -
            </button>
          </div>
          <div className="col">
            <button
              onClick={this.add_option}
              className="btn btn-danger btn-circle btn-lg"
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Radio;

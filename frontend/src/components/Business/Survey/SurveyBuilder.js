import React, { Component } from "react";
import Radio from "./Radio";
import Text from "./Text";
import "../../../../resources/css/circle-buttons.css";

class Survey extends Component {
  state = {
    Text: [],
    Radio: [],
    count: 0
  };

 
  update_data = (index, data, question) => {
    let { Questions } = this.props;
    let question_obj = {
      data,
      question
    };
    Questions[index] = question_obj;
    this.setState({ Questions });
  };

  add_radio = () => {
    let { Radio, count } = this.state;
    if (count < 5) {
      Radio.push({ id: count++, data: {} });
      this.setState({ Radio, count });
    }
  };

  remove_radio = () => {
    let { Radio, count } = this.state;
    let { Questions } = this.props;
    let popped = Radio.pop();
    delete Questions[popped.id];
    count--;
    this.setState({ Radio, count });
  };

  add_text = () => {
    let { count } = this.state;
    let { Text } = this.props;
    if (count < 5) {
      Text.push({ id: count++ });
      this.setState({ Text, count });
    }
  };

  remove_text = () => {
    let { count } = this.state;
    let { Text } = this.props;
    Text.pop();
    count--;
    this.setState({ Text, count });
  };

  remove = () => {
    let { count, Radio } = this.state;
    let { Text } = this.props;
    if (Text.length > 0) {
      this.remove_text();
    } else if (Radio.length > 0) {
      this.remove_radio();
    }
  };

  add_survey_element = () => {
    let sel = document.getElementById("mode");
    let mode = sel.options[sel.selectedIndex].value;
    if (mode === "Radio") {
      this.add_radio();
    } else if (mode === "Text") {
      this.add_text();
    }
  };

  render() {
    return (
      <React.Fragment>
        <div>
          {this.state.Radio.map(radio => (
            <React.Fragment>
              <hr />
              <Radio
                key={radio.id}
                count={radio.id}
                data={radio.data}
                values={this.props.Questions[radio.id]}
                update_data={this.update_data}
              />
            </React.Fragment>
          ))}

          {this.props.Text.map(text => (
            <React.Fragment>
              <hr />
              <Text key={text.id} count={text.id} />
            </React.Fragment>
          ))}
          <hr/>
          <div className="form-row mb-4">
            <div className="col">
              <div className="form-group">
                <select className="form-control" id="mode">
                  <option>Text</option>
                  <option>Radio</option>
                </select>
              </div>
            </div>
            <div className="col">
              <button
                type="submit"
                onClick={this.remove}
                className="btn btn-danger btn-circle btn-lg"
              >
                -
              </button>
              <button
                type="submit"
                onClick={this.add_survey_element}
                className="btn btn-success btn-circle btn-lg"
              >
                +
              </button>
            </div>
          </div>
          <hr />
        </div>
      </React.Fragment>
    );
  }
}

export default Survey;

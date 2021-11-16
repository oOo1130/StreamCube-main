import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Consumer_SignUp extends Component {
  state = {};

  years = Array.from(
    new Array(51),
    (val, index) => index + new Date("1970").getFullYear()
  );

  onChange = e => this.setState({ [e.target.name]: [e.target.value] });

  compile_data = () => {
    let day = document.getElementById("day").value;
    let month = document.getElementById("month").value;
    let year = document.getElementById("year").value;
    let date = day + "/" + month + "/" + year;

    if (!this.isValidDate(date)) {
      toast.error("Invalid date");
      return false;
    }

    let consumer_data = {};
    let e = document.getElementById("interests");
    let chosen_interests = [];

    for (let i in this.props.interests) {
      if (e[i].selected) {
        chosen_interests.push(this.props.interests[i]);
      }
    }

    if (chosen_interests.length <= 0) {
      toast.error("No interests selected");
      return false;
    }

    const dob = {
      day,
      month,
      year
    };

    consumer_data["interests"] = chosen_interests;
    consumer_data["dob"] = dob;
    consumer_data["gender"] = document.getElementById("gender").value;

    this.props.signup(consumer_data);
  };

  isValidDate = dateString => {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
      monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
  };

  render() {
    return (
      <div>
        <div>
          <div className="form-row mb-4">
            <div className="col-4">
              <label htmlFor="day">Day</label>
              <input
                type="day"
                className="form-control"
                id="day"
                min="1"
                max="31"
                placeholder="01"
              />
            </div>
            <div className="col-4">
              <label htmlFor="month">Month</label>
              <select className="form-control" id="month">
                {[...Array(12)].map((x, i) => (
                  <option key={++i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4">
              <label htmlFor="year">Year</label>
              <select className="form-control" id="year">
                {this.years.map((year, index) => {
                  return (
                    <option key={`year${index}`} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <label htmlFor="gender">Gender</label>
          <select className="form-control" id="gender">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <div className="clearfix">&nbsp;</div>
          
          <label htmlFor="interests">Interests</label>
          <select multiple className="form-control" id="interests">
            {this.props.interests.map((interest, i) => (
              <option id={interest} key={interest}>
                {interest}
              </option>
            ))}
          </select>

          <div className="clearfix">&nbsp;</div>
          
          <button
            type="submit"
            onClick={() => this.compile_data()}
            className="btn btn-primary btn-dark"
          >
            SignUp
          </button>
        </div>
      </div>
    );
  }
}

export default Consumer_SignUp;

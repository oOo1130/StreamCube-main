import React, { Component } from "react";

class Business_SignUp extends Component {
  state = {};

  compile_data = () => {
      let business_data = {}
      business_data["company_name"] = document.getElementById('company_name').value;
    //   business_data["organization_name"] = document.getElementById('organization_name').value;
    //   business_data["company_interest"] = document.getElementById('company_interest').value;
      this.props.signup(business_data);
  };

  render() {
    return (
      <div>
        <label htmlFor="company_name">Company Name</label>
        <input className="form-control" id="company_name" />
      
        <button type="submit" onClick={() => this.compile_data()} className="btn btn-primary btn-dark">
          SignUp
        </button>
      </div>
    );
  }
}

export default Business_SignUp;

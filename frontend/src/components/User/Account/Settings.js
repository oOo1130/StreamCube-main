import React, { Component } from "react";
import Account from "./Account";
import '../../../../resources/css/Settings.css'

class Settings extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="container">
          {/* <div className="row"> */}
            {/* <nav className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar">
              <div className="sidebar-sticky">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a className="nav-link active" href="#">
                      <span data-feather="home"></span>
                      Account <span className="sr-only">(current)</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <span data-feather="home"></span>
                      Payment Details <span className="sr-only">(current)</span>
                    </a>
                  </li>
         
                </ul>
              </div>
            </nav> */}
            <main role="main" className="main">
              <Account/>
            </main>
          </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}

export default Settings;

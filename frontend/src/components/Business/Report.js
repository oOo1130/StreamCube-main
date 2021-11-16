import React, { Component } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Report extends Component {
  state = {
    stats: [],
    info: [],
    url: "",
    slug: "",
  };

  componentDidMount = () => {
    let redirect_state = this.props.location.state;
    if (typeof redirect_state === "undefined") {
      this.props.history.push("/");
      return true;
    }
    let slug = redirect_state.advert_slug;
    let token = localStorage.getItem("token");
    Axios.post(
      "http://localhost:8000/api/adverts/details?",
      {
        advert_slug: slug,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token,
        },
      }
    ).then((response) => {
      let { info } = this.state;
      for (const [key, value] of Object.entries(response.data)) {
        info.push({
          key,
          value,
        });
      }
      this.setState({ slug, info });
      this.retreive_video(token, slug);
      this.load_stats(slug);
    });
  };

  retreive_video = (token, slug) => {
    Axios.post(
      "http://localhost:8000/api/video",
      {
        advert_slug: slug,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token,
        },
        responseType: "blob",
      }
    )
      .then((response) => {
        const url = URL.createObjectURL(new Blob([response.data]));
        this.setState({ url });
      })
      .catch(() => {
        toast.error("Weird, failed to get videos, please try again later");
      });
  };

  load_stats = (slug) => {
    let token = localStorage.getItem("token");
    Axios.get(
      "http://localhost:8000/api/retrieveAnalyticsAPI?",
      {
        params: {
          advert_slug: slug,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token,
        },
      }
    )
      .then((response) => {
        let { stats } = this.state;
        for (const [key, value] of Object.entries(response.data.Advert)) {
          stats.push({
            key,
            value,
          });
        }
        this.setState({ stats });
      })
      .catch((error) => {});
  };

  download_report = () => {
    let params = {
      slug: this.state.slug,
    };
    const url = [
      "http://localhost:8000/api/downloadReport",
      $.param(params),
    ].join("?");
    window.open(url);
  };

  render() {
    const style = {
      display: "block",
      width: "100%",
      height: "50%",
    };

    const wrapper = {
      position: "relative",
      paddingTop: "60% !important",
      //   "padding-bottom": "75%"
    };

    return (
      <React.Fragment>
        <div className="container">
          <div style={wrapper}>
            <video id="myVideo" style={style} src={this.state.url} controls />
          </div>
          <hr />
          <h4>Video Information</h4>
          {this.state.info.map((data) => (
            <h6 key={data.key}>
              {data.key}: {data.value}
            </h6>
          ))}
          <hr />

          <h4>Video Stats</h4>
          {this.state.stats.map((stat) => (
            <h6 key={stat.key}>
              {stat.key}: {stat.value}
            </h6>
          ))}
          <hr />
          <h4>Report Download (Most detailed)</h4>
          <button className="btn btn-primary" onClick={this.download_report}>
            Download
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Report;

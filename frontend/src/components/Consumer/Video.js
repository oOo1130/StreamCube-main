import React, { Component } from "react";
import Axios from "axios";
import Survey from "./Survey";
import { toast } from "react-toastify";

class Report extends Component {
  state = {
    url: "",
    videoEnd: false,
    slug: ""
  };
  componentDidMount = () => {
    let redirect_state = this.props.location.state;
    if (typeof redirect_state === "undefined") {
      this.props.history.push("/");
      return true;
    }
    let slug = redirect_state.advert_slug;
    this.setState({ slug });
    let token = localStorage.getItem("token");
    Axios.get("http://localhost:8000/api/consumerVideoInfo", {
      params: {
        slug
      }
    }).then(response => {
      let { title, views } = response.data;
      console.log(response.data);
      this.setState({ title, views });
    });
    if (!this.state.videoEnd) {
      this.retreive_video(token, slug);
    }
  };

  retreive_video = (token, slug) => {
    Axios.post(
      "http://localhost:8000/api/video",
      {
        advert_slug: slug
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token
        },
        responseType: "blob"
      }
    ).then(response => {
      const url = URL.createObjectURL(new Blob([response.data]));
      let vid = document.getElementById("myVideo");
      vid.src = url;
      vid.play();
      vid.addEventListener("ended", e => {
        this.setState({ videoEnd: true });
      });
    }).catch( () => {
      toast.error("Weird, we cant get the advert, try again later")
    });
  };

  maximize_video = () => {
    let videoElement = document.getElementById("myVideo");
    videoElement.requestFullscreen();
  };

  render() {
    const style = {
      display: "block",
      width: "100%",
      height: "50%"
    };

    const wrapper = {
      position: "relative",
      paddingTop: "60% !important"
    };

    const { title, views } = this.state;
    return (
      <React.Fragment>
        {this.state.videoEnd && (
          <Survey history={this.props.history} slug={this.state.slug} />
        )}
        <div className="container">
          <div className="row">
            <div className="col-md-9"> </div>
            <div id="video-wrapper" className="container-fluid">
              {" "}
              <div style={wrapper}>
                <video
                  id="myVideo"
                  style={style}
                  src={this.state.url}
                />
              </div>
              <hr />
              <h1>Title: {title}</h1>
              <p>{views} views</p>
            </div>
          </div>
          <div className="col-md-3 hidden-xs hidden-md hidden-sm"></div>
        </div>
      </React.Fragment>
    );
  }
}

export default Report;

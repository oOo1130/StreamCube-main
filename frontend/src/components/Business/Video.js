import React, { Component } from "react";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../pages/Footer/Footer";
import "../../../resources/css/footer.css";

class Video extends Component {
  state = { source: [], advert: [], pag_length: 0, page: 1, videos_no: 0 };

  get_image = (advert) => {
    let token = localStorage.getItem("token");
    let img_url = advert.advert_slug;
    Axios.post(
      "http://localhost:8000/api/image?",
      {
        img_url,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token,
        },
        responseType: "arraybuffer",
      }
    )
      .then((response) => {
        global.Buffer = global.Buffer || require("buffer").Buffer;
        const buffer = Buffer.from(response.data, "binary").toString("base64");
        let source = this.state.source;

        let advert_detail = {
          title: advert.advert_title,
          category: advert.advert_category,
          slug: advert.advert_slug,
          url: "data:image/jpeg;base64, " + buffer,
        };

        source.push(advert_detail);
        this.setState({ source });
      })
      .catch((err) => {
        toast.error("Weird, failed to retrieve images, please try again later");
      });
  };

  componentDidMount = () => {
    let token = localStorage.getItem("token");
    console.log("token: " + token);
    Axios.get("http://localhost:8000/api/businessViewAdverts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + token,
      },
    }).then((response) => {
      if (response.data.length > 0) {
        let pag_length = 0;
        if (response.data.length < 9) {
          pag_length = 1;
        } else {
          pag_length = Math.ceil(response.data.length / 9);
        }
        this.setState({ pag_length, videos_no: response.data.length });
        for (let i = 0; i < response.data.length; i++) {
          let advert = this.state.advert;
          advert.push(response.data[i]);
          this.setState({ advert });
          this.get_image(response.data[i]);
          let resData = response.data;
          console.log("respponse: " + response.data);
        }

        this.update_page(1);
      }
    });
  };

  open_report = (slug) => {
    this.props.history.push({
      pathname: "/report",
      state: { advert_slug: slug },
    });
  };
  // added some code in here
  open_edit = (slug) => {
    this.props.history.push({
      pathname: "/edit",
      state: { advert_slug: slug },
    });
  };

  card_views = () => {
    const card_style = {
      width: "30%",
      display: "inline-block",
      margin: " calc(10%/10) calc(10%/6) calc(10%/10) calc(10%/6)",
    };

    let cards = [];
    let end = this.state.page * 9;
    let sub = 0;

    if (end > this.state.videos_no) {
      sub = end - this.state.videos_no;
    }

    for (
      let i = end - 9, count = 0;
      (i < end - sub) & (typeof this.state.source[i] !== "undefined");
      i++, count++
    ) {
      const badge = this.generate_tag(this.state.source[i].category);
      cards.push(
        <div
          key={this.state.source[i].title}
          className="card"
          style={card_style}
        >
          <img
            className="card-img-top img-thumbnail"
            src={this.state.source[i].url}
            alt="Card image cap"
          />
          <div className="card-body">
            <h5 className="card-title">{this.state.source[i].title} </h5>
            <p className="card-text">
              {" "}
              <span className={badge}>{this.state.source[i].category}</span>
            </p>
            <button
              onClick={() => this.open_report(this.state.source[i].slug)}
              className="btn btn-primary"
            >
              View Report
            </button>
            {console.log("test" + this.state.source[i].slug)}
            <button
              // disabled
              onClick={() => this.open_edit(this.state.source[i].slug)}
              className="btn btn-danger m-1"
            >
              Edit
            </button>
          </div>
        </div>
      );
    }
    if (cards.length === 0) {
      cards.push(<h2 key={0}>No Adverts to views</h2>);
    }

    return cards;
  };

  generate_tag = (type) => {
    //could alter to return css class to have a range of colours for badge
    let colour = "";
    if (type === "Technology") {
      colour = "info";
    } else if (type === "Sports") {
      colour = "success";
    } else if (type === "Health") {
      colour = "warning";
    } else {
      colour = "dark";
    }
    let badge = "badge badge-" + colour;

    return badge;
  };

  update_page = (page_no) => {
    const { pag_length } = this.state;

    for (let i = 1; i <= pag_length; i++) {
      document.getElementById("page-" + i).className = "page-item";
    }

    document.getElementById("page-" + page_no).className = "page-item active";
    this.setState({ page: page_no });
  };

  render() {
    const card_style = {
      width: "18rem",
      display: "inline-block",
    };
    return (
      <React.Fragment>
        <div className="container-fluid">
          {this.card_views()}
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              {[...Array(this.state.pag_length)].map((x, i) => (
                <li
                  key={"page-" + (i + 1)}
                  className="page-item"
                  id={"page-" + (i + 1)}
                >
                  <a
                    key={i}
                    onClick={() => this.update_page(i + 1)}
                    className="page-link"
                  >
                    {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default Video;

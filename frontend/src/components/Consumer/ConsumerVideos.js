import React, { Component } from "react";
import Axios from "axios";

class ConsumerVideos extends Component {
  state = { source: [], advert: [], pag_length: 0, page: 1, videos_no: 0 };

  get_image = advert => {
    let token = localStorage.getItem("token");
    let img_url = advert.advert_slug;
    Axios.post(
      "http://localhost:8000/api/image?",
      {
        img_url
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token
        },
        responseType: "arraybuffer"
      }
    )
      .then(response => {
        global.Buffer = global.Buffer || require("buffer").Buffer;
        const buffer = Buffer.from(response.data, "binary").toString("base64");
        let source = this.state.source;

        let advert_detail = {
          title: advert.advert_title,
          category: advert.advert_category,
          slug: advert.advert_slug,
          url: "data:image/jpeg;base64, " + buffer
        };

        source.push(advert_detail);
        this.setState({ source });
      })
      .catch(err => {
        console.log(err);
        // toast.error("Username and/or password are incorrect");
      });
  };

  componentDidMount = () => {
    let token = localStorage.getItem("token");
    Axios.post(
      "http://localhost:8000/api/consumerVideos",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token
        }
      }
    ).then(response => {
      let len = response.data.advert_list.length;
      let data = response.data.advert_list;
      if (len > 0) {
        let pag_length = 0;
        if (len < 9) {
          pag_length = 1;
        } else {
          pag_length = Math.ceil(len / 9);
        }
        this.setState({ pag_length, videos_no: len });
        this.setState({ advert: data });

        for (let i = 0; i < data.length; i++) {
          this.get_image(data[i]);
        }
        this.update_page(1);
      }
    });
  };

  open_video = slug => {
    this.props.history.push({
      pathname: "/advertstream",
      state: { advert_slug: slug , history: this.props.history}
    });
  };

  card_views = () => {
    const card_style = {
      width: "30%",
      display: "inline-block",
      margin: " calc(10%/10) calc(10%/6) calc(10%/10) calc(10%/6)"
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
      const img_style = {
        position: "relative",
        color: "white"
      };

      const bottom_left = {
        position: "absolute",
        bottom: "-6px",
        left: "16px",
        color: "black"
      };

      const bottom_right = {
        position: "absolute",
        bottom: "8px",
        right: "16px"
      };

      const badge = this.generate_tag(this.state.source[i].category);
      cards.push(
        <div
          key={this.state.source[i].title}
          className="card"
          style={card_style}
          onClick={() => this.open_video(this.state.source[i].slug)}
        >
          <img
            className="card-img-top img-thumbnail"
            src={this.state.source[i].url}
            style={img_style}
            alt="Card image cap"
          />
          <h5 className="card-title" style={bottom_left}>
            {this.state.source[i].title}
          </h5>

          <span className={badge} style={bottom_right}>
            {this.state.source[i].category}
          </span>
        </div>
      );
    }

    return cards;
  };

  generate_tag = type => {
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

  update_page = page_no => {
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
      display: "inline-block"
    };
    return (
      <React.Fragment>
        <div className="">
          <div></div>
          {this.card_views()}
          <ul className="pagination justify-content-center">
            {[...Array(this.state.pag_length)].map((x, i) => (
              <li key={"page-"+(i+1)} className="page-item" id={"page-" + (i + 1)}>
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
        </div>
      </React.Fragment>
    );
  }
}

export default ConsumerVideos;

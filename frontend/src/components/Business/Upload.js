import React, { Component } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Survey from "./Survey/SurveyBuilder";

class Upload extends Component {
  state = {
    Questions: {},
    Text: [],
  };

  upload_survey = () => {
    let { Text, Questions } = this.state;

    let questions = [];

    for (const [key, value] of Object.entries(Questions)) {
      let choices = [];
      let size = Object.keys(value.data).length;
      for (let z = 0; z < size; z++) {
        let op = "option" + (z + 1);
        let data = value.data[op];
        choices.push({ choice: data });
      }

      questions.push({
        question: value.question,
        answer_type: "RADIO_SELECT",
        choices,
      });
    }

    for (let i = 0; i < Text.length; i++) {
      let index = Text[i].id;
      let question = document.getElementById("question_" + index).value;

      questions.push({
        question,
        answer_type: "TEXT",
      });
    }

    let object = {
      name: document.getElementById("title").value,
      questions,
    };

    let token = localStorage.getItem("token");

    axios
      .post("http://localhost:8000/api/createSurvey", object, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token,
        },
      })
      .then(() => {
        toast.success("Advert uploaded, go back to Adverts or upload more");
      })
      .catch(() => {
        toast.error("Failed to create survey");
      });
  };

  /**
   * Function returns a thumbnail based upon the video file
   * Written by: user1032613
   * StackOverFlow Profile: https://stackoverflow.com/users/1032613/user1032613
   */
  getVideoCover = (file, seekTo = 0.0) => {
    console.log("getting video cover for file: ", file);
    return new Promise((resolve, reject) => {
      // load the file to a video player
      const videoPlayer = document.createElement("video");
      videoPlayer.setAttribute("src", URL.createObjectURL(file));
      videoPlayer.load();
      videoPlayer.addEventListener("error", (ex) => {
        toast.error("error when loading video file", ex);
        console.log(ex);
      });
      // load metadata of the video to get video duration and dimensions
      videoPlayer.addEventListener("loadedmetadata", () => {
        // seek to user defined timestamp (in seconds) if possible
        if (videoPlayer.duration < seekTo) {
          toast.error("video is too short.");
          return;
        }
        // delay seeking or else 'seeked' event won't fire on Safari
        setTimeout(() => {
          videoPlayer.currentTime = seekTo;
        }, 200);
        // extract video thumbnail once seeking is complete
        videoPlayer.addEventListener("seeked", () => {
          // console.log("video is now paused at %ss.", seekTo);
          // define a canvas to have the same dimension as the video
          const canvas = document.createElement("canvas");
          canvas.width = videoPlayer.videoWidth;
          canvas.height = videoPlayer.videoHeight;
          // draw the video frame to canvas
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
          // return the canvas image as a blob
          ctx.canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/png",
            0.75 /* quality */
          );
        });
      });
    });
  };

  onChangeHandler = () => {
    let { Questions, Text } = this.state;
    let file = document.getElementById("video_file").files[0];
    let img = document.getElementById("image_file").files[0];
    let title = document.getElementById("title").value;
    let budget = document.getElementById("budget").value;
    let isValid = budget.match(/^\d+(\.\d{1,2})?$/);
    let textValid = true;
    let size = Object.keys(Questions).length;

    for (let i = 0; i < Text.length; i++) {
      let index = Text[i].id;
      let question = document.getElementById("question_" + index).value;
      if (question.trim().length === 0) {
        textValid = false;
      }
    }

    console.log(Questions);

    for (const index in Questions) {
      for (const [key, value] of Object.entries(Questions[index].data)) {
        if (value.length === 0) {
          textValid = false;
        }
      }
    }

    //Basic validation
    if (title.trim() === "") {
      toast.error("Title is invalid");
      return false;
    } else if (typeof file === "undefined") {
      toast.error("No file selected");
      return false;
    } else if (
      typeof budget === "undefined" ||
      !isValid ||
      parseInt(budget) <= 0
    ) {
      toast.error("Budget is invalid");
      return false;
    } else if ((!Text.length > 0 && !size > 0) || !textValid) {
      toast.error("Survey missing questions");
      return false;
    }

    const urlCreator = window.URL || window.webkitURL;

    let token = localStorage.getItem("token");

    this.getVideoCover(file, 1.5).then((cover) => {
      let file = "";
      if (typeof img === "undefined") {
        const url = urlCreator.createObjectURL(cover);
        file = new File([cover], "file.png", {
          type: "image/png",
        });
      } else {
        file = img;
      }

      const form_data = new FormData();
      form_data.append("advert_title", document.getElementById("title").value);
      form_data.append(
        "advert_category",
        document.getElementById("category").value
      );
      form_data.append(
        "advert_budget",
        document.getElementById("budget").value
      );
      form_data.append(
        "advert_file",
        document.getElementById("video_file").files[0]
      );

      form_data.append("advert_image", file);

      axios
        .post("http://localhost:8000/api/upload_advert", form_data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "token " + token,
          },
        })
        .then(() => {
          this.upload_survey();
        })
        .catch(() => {
          toast.error(
            "Failed to upload video, you may have already used video title"
          );
        });
    });
  };

  validate_data = () => {};

  render() {
    return (
      <div className="form">
        <div className="form-group">
          <ToastContainer />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="email"
            className="form-control"
            id="title"
            placeholder="title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Example select</label>
          <select className="form-control" id="category">
            <option>Sports</option>
            <option>Technology</option>
            <option>Health</option>
            <option>DIY</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="budget">budget</label>
          <input
            type="numbers"
            className="form-control"
            id="budget"
            placeholder="0.0"
          />
        </div>
        <img src={this.state.logo} />
        <input type="file" id="video_file" name="video" />

        <input type="file" id="image_file" name="img" accept="image/*" />
        <Survey
          key="Survey"
          Questions={this.state.Questions}
          Text={this.state.Text}
        />
        <button
          type="submit"
          onClick={this.onChangeHandler}
          className="btn btn-primary btn-dark"
        >
          Submit
        </button>
      </div>
    );
  }
}

export default Upload;

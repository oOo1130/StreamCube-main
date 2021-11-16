import React, { Component } from "react";
import RadioQuestion from "./RadioQuestion";
import TextQuestion from "./TextQuestion";
import Axios from "axios";
import { toast, ToastContainer } from "react-toastify";

class Survey extends Component {
  state = {
    name: "",
    answers: {},
    questionNo: 0,
    currentQuest: "",
    currentQuestIndex: 0,
    survey_questions: []
  };

  componentDidMount = () => {
    this.generate_survey();
    $("#examplemodal").modal("show");
  };

  update_answers = (question, answer) => {
    let { answers } = this.state;
    answers[question] = answer;
    this.setState({ answers });
  };

  submit_answers = () => {
    let answers = this.format_answers();
    $("#examplemodal").modal("hide");
    let token = localStorage.getItem("token");
    Axios.post(
      "http://localhost:8000/api/completeSurvey?",
      {
        answers,
        slug: this.props.slug
      },

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token
        }
      }
    )
      .then((response) => {
        let {msg} = response.data
        if (msg){
            toast.success("Balance Updated");
        }else{
            toast.error("Something went wrong, try again later ");
        }
        // this.props.history.push("/consumervideos"); // change to redirect
      })
      .catch(() => {
        toast.error("Oops an error happened, try again later");
      });
  };

  format_answers = () => {
    let answers = [];

    for (const [key, value] of Object.entries(this.state.answers)) {
      let answer = {
        answer: value
      };
      answers.push(answer);
    }

    return answers;
  };

  generate_survey = () => {
    let { survey_questions, questionNo } = this.state;

    let token = localStorage.getItem("token");
    Axios.get(
      "http://localhost:8000/api/completeSurvey?",
      {
        params: {
          slug: this.props.slug
        }
      },

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "token " + token
        }
      }
    )
      .then(response => {
        let questions = response.data.questions;

        let survey = {
          name: "test",
          questions
        };

        let quest = survey.questions;
        for (const [key, value] of Object.entries(quest)) {
          if (value.answer_type === "RADIO_SELECT") {
            survey_questions.push(
              <RadioQuestion
                key={key}
                index={key}
                update_answers={this.update_answers}
                question={value.question}
                choices={value.choices}
              />
            );
          } else {
            survey_questions.push(
              <TextQuestion
                key={key}
                index={key}
                update_answers={this.update_answers}
                question={value.question}
              />
            );
          }
        }

        questionNo = survey_questions.length;
        this.setState({
          name: survey.name,
          survey_questions,
          questionNo,
          currentQuestIndex: 0
        });

        this.get_question();
      })
      .catch(err => {
        toast.error(
          "Weird, an error happened getting the survey, try again later!"
        );
      });
  };

  get_question = () => {
    let {
      survey_questions,
      questionNo,
      currentQuest,
      currentQuestIndex,
      answers
    } = this.state;

    let answersize = Object.keys(answers).length;

    if ((answersize < currentQuestIndex) & (currentQuestIndex != 0)) {
      toast.error("Question not answered");
      return false;
    }

    if (currentQuestIndex < survey_questions.length) {
      let index = currentQuestIndex;
      currentQuest = survey_questions[index];
    } else if (questionNo !== 0) {
      currentQuest = "finished";
    }

    this.setState({ currentQuest, currentQuestIndex: currentQuestIndex + 1 });
  };

  get_button = () => {
    let { currentQuest } = this.state;

    if (currentQuest === "finished") {
      return (
        <button
          type="submit"
          className="btn btn-primary"
          onClick={this.submit_answers}
        >
          submit
        </button>
      );
    } else {
      return (
        <button
          type="submit"
          className="btn btn-primary"
          onClick={this.get_question}
        >
          Next
        </button>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="modal fade" id="examplemodal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{this.state.name}</h4>
              </div>
              <div className="modal-body">{this.state.currentQuest}</div>
              <div className="modal-footer">{this.get_button()}</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Survey;

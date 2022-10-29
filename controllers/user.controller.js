const db = require("../models");
const QuestionSet = db.questionsets;
const Question = db.questions;
const Survey = db.surveys;
const ResponseSet = db.responsesets;
const Resp = db.responses;
const PendingSurvey = db.pendingsurveys;

const Op = db.Sequelize.Op;

exports.getReport = (req, res) => {
  const clientObject = {
    status: "success",
    data: {
      themes: req.themes,
    },
  };

  console.log(clientObject.data.themes);

  res.status(200).send(clientObject);
};

// fetch pending surveys for user
exports.getUserPendingSurvey = (req, res) => {
  // array to store id's for pending surveys
  let pendingSurveyIds = [];
  // get pending surveys, if any, for user
  console.log(req.params.id);
  PendingSurvey.findAll({
    attributes: ["id", "questionsetId"],
    where: { employeeId: req.params.id },
    order: [["id", "ASC"]],
  })
    .then((pendingSurveys) => {
      // loop pushes all pending survey id's to array
      for (let index = 0; index < pendingSurveys.length; index++) {
        pendingSurveyIds.push(pendingSurveys[index].dataValues.id);
      }
      // get question set id associated with the first pending survey
      let questionSetId = pendingSurveys[0].dataValues.questionsetId;
      // get the questions that belong to the question set of the first pending survey
      return Question.findAll({
        attributes: ["id","question", "value", "label", "questionsetId"],
        include: [
          {
            attributes: ["id"],
            model: QuestionSet,
            where: {
              id: questionSetId,
            },
            required: true,
          },
        ],
        order: [["id", "ASC"]],
      });
    })
    // this then() formats all of the questions and their values and labels, and puts it all in an array (questionSet)
    // and builds the final client object and sends it to the client
    .then((questions) => {
      let questionSet = [];
      let questionSetId;
      for (let index = 0; index < questions.length; index++) {
        let questionReceived = questions[index].dataValues;
        questionSetId = questionReceived.questionsetId;
        let optionsArr = [];

        let innerLoopLength = questionReceived.value.length;
        for (
          let indexInnerLoop = 0;
          indexInnerLoop < innerLoopLength;
          indexInnerLoop++
        ) {
          let optionsElement = {
            value: questionReceived.value[indexInnerLoop],
            label: questionReceived.label[indexInnerLoop],
          };
          optionsArr.push(optionsElement);
        }
        questionSet.push({
          id: questionReceived.id,
          question: questionReceived.question,
          options: optionsArr,
        });
      }

      const clientObject = {
        status: "success",
        data: {
          id: questionSetId,
          questionSet: questionSet,
          pendingSurveys: pendingSurveyIds,
        },
      };
      res.status(200).send(clientObject);
    })
    .catch((error) => {
      console.log(error);

      const clientObject = {
        status: "success",
        message: "error occurred when trying to get pending survey for user",
      };
      res.status(500).send(clientObject);
    });
};

// store the results of a completed survey
exports.createUserSurvey = (req, res) => {
  let userId = req.params.id;
  let responseSetId;

  let questionSetId = req.body.questionSetId;
  let pendingSurveyId = req.body.pendingSurveyId;
  // create the survey
  Survey.create({
    employeeId: userId,
    questionsetId: questionSetId,
  })
    .then((completedSurvey) => {
      let surveyId = completedSurvey.dataValues.id;
      let questionSetId = completedSurvey.dataValues.questionsetId;
      // create the response set
      return ResponseSet.create({
        questionsetId: questionSetId,
        surveyId: surveyId,
      });
    })
    .then((responseSet) => {
      responseSetId = responseSet.dataValues.id;
      // loop through responses and store them in database
      let promiseList = [];
      for (let index = 0; index < req.body.questions.length; index++) {
        let questionReceived = req.body.questions[index];
        let response = req.body.userResponses[index].selectedOptionValue;
        let optionalResponse = req.body.userResponses[index].userInputText;
        console.log(req.body.questions)

        let promise = Resp.create({
          response: response,
          optResponse: optionalResponse,
          anonymous: req.body.anonymous,
          responsesetId: responseSetId,
          questionId: questionReceived.id,
          employeeId: userId,
        });
        promiseList.push(promise);
      }

      return Promise.all(promiseList);
    })
    .then(() => {
      return PendingSurvey.destroy({
        where: { id: pendingSurveyId },
      });
    })
    .then(() => {
      const clientObject = {
        status: "success",
        data: null,
      };
      res.status(200).send(clientObject);
    })
    .catch((error) => {
      console.log(error);

      const clientObject = {
        status: "success",
        message: "error occurred when trying to submit survey results",
      };
      res.status(500).send(clientObject);
    });
};

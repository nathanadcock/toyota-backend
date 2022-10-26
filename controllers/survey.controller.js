const db = require("../models");
const Employee = db.employees;
const QuestionSet = db.questionsets;
const Question = db.questions;
const Survey = db.surveys;
const ResponseSet = db.responsesets;
const Resp = db.responses;

const Op = db.Sequelize.Op;

// fetch pending survey for user
exports.fetchSurvey = (req, res) => {

  // get pending survey, if any, for user
  QuestionSet.findOne({
      attributes: ['id'],
      include: [{
        attributes: ['id'],
        model: Employee,
        where: {
          id: req.params.id
        },
        required: true
      }],
      order: [
        ['id', 'ASC']
      ],
    })
    .then((pendingSurvey) => {
      // get question set id associated with the pending survey
      let questionSetId = pendingSurvey.dataValues.id;
      // get the questions that belong to the question set
      return Question.findAll({
        attributes: ['question', 'value', 'label'],
        include: [{
          attributes: ['id'],
          model: QuestionSet,
          where: {
            id: questionSetId
          },
          required: true
        }],
        order: [
          ['id', 'ASC']
        ],
      })
    })
    // this then() formats all of the questions and their values and labels, and puts it all in an array (questionSet) and sends the array to the client
    .then((questions) => {
      let questionSet = [];
      for (let index = 0; index < questions.length; index++) {
        let questionReceived = questions[index].dataValues;
        let optionsArr = [];

        let innerLoopLength = questionReceived.value.length;
        for (let indexInnerLoop = 0; indexInnerLoop < innerLoopLength; indexInnerLoop++) {
          let optionsElement = {
            value: questionReceived.value[indexInnerLoop],
            label: questionReceived.label[indexInnerLoop]
          };
          optionsArr.push(optionsElement);
        }
        questionSet.push({
          question: questionReceived.question,
          options: optionsArr
        });
      }
      res.status(200).send(questionSet);
    })
    .catch((error) => {
      console.log(error);
    })
};

// store the results of a completed survey
exports.storeSurveyResults = (req, res) => {
  let userId = req.body.userId;
  let responseSetId;

  // get completed question set
  QuestionSet.findOne({
      attributes: ['id'],
      include: [{
        attributes: ['id'],
        model: Employee,
        where: {
          id: userId
        },
        required: true
      }],
      order: [
        ['id', 'ASC']
      ],
    })
    .then((completedQuestionSet) => {
      // get question set id
      let questionSetId = completedQuestionSet.dataValues.id;
      // create the survey
      return Survey.create({
        employeeId: userId,
        questionsetId: questionSetId,
      })
    })
    .then((completedSurvey) => {
      let surveyId = completedSurvey.dataValues.id;
      let questionSetId = completedSurvey.dataValues.questionsetId;
      // create the response set
      return ResponseSet.create({
        questionsetId: questionSetId,
        surveyId: surveyId,
      })
    })
    .then((responseSet) => {
      responseSetId = responseSet.dataValues.id;
      // find questions associated with responses
      return Question.findAll({
        attributes: ['id'],
        include: [{
          attributes: ['id'],
          model: QuestionSet,
          where: {
            id: responseSet.dataValues.questionsetId
          },
          required: true
        }],
        order: [
          ['id', 'ASC']
        ],
      })
    })
    .then((questions) => {
      // loop through responses and store them in database
      let promiseList = [];
      let anonymous = req.body.anonymous;
      for (let index = 0; index < questions.length; index++) {
        let questionReceived = questions[index].dataValues;
        let questionId = questionReceived.id;
        let response = req.body.userResponses[index].selectedOptionValue;
        let optionalResponse = req.body.userResponses[index].userInputText;

        let promise = Resp.create({
          response: response,
          optResponse: optionalResponse,
          anonymous: anonymous,
          responsesetId: responseSetId,
          questionId: questionId,
        })
        promiseList.push(promise);
      }

      return Promise.all(promiseList);
    })
    .then((responses) => {
      res.status(200).send({
        message: 'success',
      });
    })
    .catch((error) => {
      console.log(error);
    })
};
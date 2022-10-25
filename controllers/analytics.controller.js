const db = require("../models");
const Employee = db.employees;
const QuestionSet = db.questionsets;
const Question = db.questions;
const Resp = db.responses;
const Op = db.Sequelize.Op;

// fetch pending survey for user
exports.fetchQuestionSetData = (req, res) => {

  let questionSetData = [];
  let questions;
  // get pending survey, if any, for user
  QuestionSet.findOne({
    attributes: ['id', 'name'],
    where: {
      name: req.body.questionSetName,
    }
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
        where: {id: questionSetId},
        required: true
      }],
      order: [
        ['id', 'ASC']
      ],
    })
  })
  .then((questionsObj) => {
    questions = questionsObj;
    let promiseList = [];
    for(let index = 0; index < questionsObj.length; index++) {
      let questionReceived = questionsObj[index].dataValues;
      let questionId = questionReceived.id;

      let promise = Resp.findAll({
        attributes: ['id', 'response', 'optResponse', 'anonymous'],
        where: {questionId: questionId},
      });

      promiseList.push(promise);
    }
    return promiseList;
  })
  // this then() formats all of the questions and their values and labels, and puts it all in an array (questionSet) and sends the array to the client
  .then((responses) => {
    for(let index = 0; index < questions.length; index++) {
      let questionReceived = questions[index].dataValues;
      let optionsArr = [];

      let innerLoopLength = questionReceived.value.length;
      for(let indexInnerLoop = 0; indexInnerLoop < innerLoopLength; indexInnerLoop++) {
        let optionsElement = {
          value: questionReceived.value[indexInnerLoop],
          label: questionReceived.label[indexInnerLoop],
          response: [],
        };
        optionsArr.push(optionsElement);
      }
      questionSetData.push({question: questionReceived.question, options: optionsArr});
    }
    res.status(200).send(questionSetData);
  })
  .catch((error) => {
    console.log(error);
  })
};
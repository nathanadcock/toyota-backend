const db = require("../models");
const Employee = db.employees;
const QuestionSet = db.questionsets;
const Question = db.questions;

const Op = db.Sequelize.Op;

exports.fetchSurvey = (req, res) => {
  // fetch pending survey for user
  let finalObject = {
    questionSet: [],
    questionResponses: [],
    currentQuestionIndex: 0,
    endPageVisibility: false,
    anonymousResponses: false,
  }

  QuestionSet.findAll({
    attributes: ['id'],
    include: [{
      attributes: ['id'],
      model: Employee,
      where: {id: req.params.id},
      required: true
    }]
  })
  .then((pendingSurveys) => {
    for(let i = 0; i < pendingSurveys.length; i++) {
      let qsId = pendingSurveys[i].dataValues.id

      Question.findAll({
        attributes: ['question', 'options'],
        include: [{
          attributes: ['id'],
          model: QuestionSet,
          where: {id: qsId},
          required: true
        }]
      })
      .then((questions) => {
        for(let index = 0; index < questions.length; index++) {
          let question = questions[index]
          finalObject.questionSet.push({question: question.dataValues.question, options: question.dataValues.options})
          finalObject.questionResponses.push({selectedOptionValue: undefined, userInputText: ''})
        }

        return finalObject;
      })
      .then((obj) => {
        res.status(200).send(obj);
      })
      .catch((error) => {
        console.log(error)
      })
    }
  })
  .catch((error) => {
    console.log(error)
  })
};
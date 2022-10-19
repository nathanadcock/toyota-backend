const db = require("../models");
const Employee = db.employees;
const QuestionSet = db.questionsets;
const Question = db.questions;

const Op = db.Sequelize.Op;

exports.fetchSurvey = (req, res) => {
  // fetch pending survey for user
  let finalObject = {
    questionSet: []
  }

  QuestionSet.findOne({
    attributes: ['id'],
    include: [{
      attributes: ['id'],
      model: Employee,
      where: {id: req.params.id},
      required: true
    }]
  })
  .then((pendingSurvey) => {
      let qsId = pendingSurvey.dataValues.id

      return Question.findAll({
        attributes: ['question', 'value', 'label'],
        include: [{
          attributes: ['id'],
          model: QuestionSet,
          where: {id: qsId},
          required: true
        }]
      })
  })
  .then((questions) => {
    for(let index = 0; index < questions.length; index++) {
      let question = questions[index]
      let optionsObj = []

      for(let index2 = 0; index2 < question.dataValues.value.length; index2++) {
        let optionsElement = {
          value: question.dataValues.value[index2],
          label: question.dataValues.label[index2]
        }
        optionsObj.push(optionsElement);
      }

      finalObject.questionSet.push({question: question.dataValues.question, options: optionsObj})
    }

    return finalObject;
  })
  .then((obj) => {
    res.status(200).send(obj);
  })
  .catch((error) => {
    console.log(error)
  })
};
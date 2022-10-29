const db = require("../models");
const QuestionSet = db.questionsets;
const Question = db.questions;
const Survey = db.surveys;
const ResponseSet = db.responsesets;
const Resp = db.responses;
const PendingSurvey = db.pendingsurveys;

const Op = db.Sequelize.Op;

exports.createQuestionSet = (req, res) => {
  QuestionSet.findOne({
    attributes: ['id', '']
  })
  .then(user => {
    res.send({
      message: "Employee was registered successfully!"
    });
  })
  .catch(err => {
    res.status(500).send({
      message: err.message
    });
  });
};

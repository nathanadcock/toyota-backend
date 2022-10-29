const db = require("../models");
const Employee = db.employees;
const QuestionSet = db.questionsets;
const Question = db.questions;
const Survey = db.surveys;
const ResponseSet = db.responsesets;
const Resp = db.responses;
const PendingSurvey = db.pendingsurveys;

const Op = db.Sequelize.Op;

// fetch pending survey based on id
exports.getPendingSurvey = (req, res) => {

  // get pending survey
  PendingSurvey.findOne({
      attributes: ['id', 'questionsetId', 'employeeId'],
      where: {employeeId: req.params.id},
      order: [
        ['id', 'ASC']
      ],
    })
    .then((pendingSurvey) => {
      // get pending survey attributes
      let id = pendingSurvey.dataValues.id;
      let questionSetId = pendingSurvey.dataValues.questionsetId;
      let employeeId = pendingSurvey.dataValues.employeeId;

      const pendSurveyObj = {
        id: id,
        questionSetId: questionSetId,
        employeeId, employeeId,
      }
      res.status(200).send(pendSurveyObj);
    })
    .catch((error) => {
      console.log(error);
    })
};

// fetch all pending surveys
exports.getPendingSurveys = (req, res) => {

  // get all pending surveys
  PendingSurvey.findAll({
      attributes: ['id', 'questionsetId', 'employeeId'],
      order: [
        ['id', 'ASC']
      ],
    })
    .then((pendingSurveys) => {
      let pendingSurveyList = [];
      for(let index = 0; index < pendingSurveys.length; index++) {
        // get pending survey attributes
        let id = pendingSurvey.dataValues.id;
        let questionSetId = pendingSurvey.dataValues.questionsetId;
        let employeeId = pendingSurvey.dataValues.employeeId;

        const pendSurveyObj = {
          id: id,
          questionSetId: questionSetId,
          employeeId, employeeId,
        }
        pendingSurveyList.push(pendSurveyObj);
      }
      res.status(200).send(pendingSurveyList);
    })
    .catch((error) => {
      console.log(error);
    })
};

// create pending survey for user
exports.createPendingSurvey = (req, res) => {
  // create pending survey
  PendingSurvey.create({
      id: req.params.id,
      questionsetId: req.params.questionSetId,
      employeeId: req.params.employeeId,
    })
    .then((pendingSurvey) => {
      const clientObject = {
        status: "success",
        data: null,
      };
      res.status(200).send(clientObject);
    })
    .catch((error) => {
      console.log(error);
    })
};

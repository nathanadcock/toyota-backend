const db = require("../models");
const Employee = db.employees;
const QuestionSet = db.questionsets;
const Question = db.questions;
const Resp = db.responses;
const ResponseSet = db.responsesets;
const Survey = db.surveys;

// fetch pending survey for user
exports.fetchQuestionSetData = (req, res) => {
  let questionSetData = {name: '', questions: []};
  let questionMap = new Map();
  let questionSetId;
  let questions;
  let responses;
  // get pending survey, if any, for user
  QuestionSet.findOne({
    attributes: ['id', 'name'],
    where: {
      name: req.body.name,
    }
  })
  .then((pendingSurvey) => {
    // get question set id associated with the pending survey
    questionSetId = pendingSurvey.dataValues.id;
    // get the questions that belong to the question set
    return Question.findAll({
      attributes: ['id', 'question', 'value', 'label'],
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

      questionMap.set(questionId, index);

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
      questionSetData.questions.push({question: questionReceived.question, options: optionsArr});

      let promise = Resp.findAll({
        attributes: ['id', 'response', 'optResponse', 'anonymous', 'questionId'],
        where: {questionId: questionId},
      });

      promiseList.push(promise);
    }
    return Promise.all(promiseList);
  })
  .then((responsesObj) => {
    responses = responsesObj;
    let promiseList = [];

    for(index = 0; index < responsesObj.length; index++) {
      for(innerIndex = 0; innerIndex < responsesObj[index].length; innerIndex++) {
        let response = responsesObj[index][innerIndex].dataValues;
        let questionId = response.questionId;
        let employeeName;
        let employeeId;
        let managerName;

        let promise = ResponseSet.findOne({
          attributes: ['surveyId'],
          include: [{
            model: Resp,
            where: {id: response.id},
            required: true,
          }]
        })
        .then((responseSet) => {
          let surveyId = responseSet.dataValues.surveyId;
          return Survey.findOne({
            attribures: ['employeeId'],
            include: [{
              model: ResponseSet,
              where: {surveyId: surveyId},
              required: true,
            }]
          })
        })
        .then((survey) => {
          employeeId = survey.dataValues.employeeId;
          return Employee.findOne({
            attributes: ['firstName', 'lastName', 'managerId'],
            include: [{
              model: Survey,
              where: {employeeId: employeeId},
              required: true,
            }]
          })
        })
        .then((employee) => {
          //console.log(employee)
          employeeName = (employee.dataValues.firstName + " " + employee.dataValues.lastName);
          let managerId = employee.dataValues.managerId;
          if(managerId !== null) {
            return Employee.findOne({
              attributes: ['firstName', 'lastName'],
              where: {id: employee.dataValues.managerId},
            })
          }
          return null;
        })
        .then((manager) => {
          if(manager !== null) {
            managerName = (manager.dataValues.firstName + " " + manager.dataValues.lastName);
          } else {
            managerName = 'No manager';
          }

          let finalResponseObj = {
            userInputText: response.optResponse,
            authorId: employeeId,
            authorName: employeeName,
            managerName: managerName,
            anonymous: response.anonymous,
          }

          for(let index = 0; index < questionSetData.questions[questionMap.get(questionId)].options.length; index++) {
            if (response.response === questionSetData.questions[questionMap.get(questionId)].options[index].value) {
              questionSetData.questions[questionMap.get(questionId)].options[index].response.push(finalResponseObj);
              break;
            }
          }
          return;
        })
        promiseList.push(promise);
      }
    }
    return Promise.all(promiseList);
  })
  .then(() => {
    questionSetData.name = req.body.name;
    res.status(200).send(questionSetData);
  })
  .catch((error) => {
    console.log(error);
  })
};
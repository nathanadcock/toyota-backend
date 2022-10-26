const db = require("../models");
const Employee = db.employees;
const QuestionSet = db.questionsets;
const Question = db.questions;
const Resp = db.responses;
const ResponseSet = db.responsesets;
const Survey = db.surveys;
const Theme = db.themes;

exports.fetchThemes = (req, res, next) => {
  req.themes = [];
  let themeMap = new Map();

  Theme.findAll({
      attributes: ['id', 'name'],
      order: [
        ['id', 'ASC']
      ],
    })
    .then((themes) => {
      for (let index = 0; index < themes.length; index++) {
        let themeReceived = themes[index].dataValues;
        let themeId = themeReceived.id;
        let themeName = themeReceived.name;

        req.themes.push({
          id: themeId,
          name: themeName,
          questionSets: []
        });
        themeMap.set(themeId, index);
      }
      req.themeMap = themeMap;
      next()
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: 'could not fetch any themes'
      })
    })
}

exports.fetchQuestionSets = (req, res, next) => {
  let questionSetMap = new Map();
  let questionSetThemeMap = new Map();

  QuestionSet.findAll({
      attributes: ['id', 'name', 'themeId'],
      order: [
        ['id', 'ASC']
      ],
    })
    .then((questionSets) => {
      let themeMap = req.themeMap;

      for (let index = 0; index < questionSets.length; index++) {
        let questionSetReceived = questionSets[index].dataValues;
        let questionSetId = questionSetReceived.id;
        let questionSetName = questionSetReceived.name;
        let themeId = questionSetReceived.themeId;
        let themeIndex = themeMap.get(themeId);

        let questionSetObj = {
          id: questionSetId,
          name: questionSetName,
          questions: [],
        }

        let questionSetIndex = req.themes[themeIndex].questionSets.push(questionSetObj) - 1;
        questionSetMap.set(questionSetId, questionSetIndex);
        questionSetThemeMap.set(questionSetId, themeId);
      }
      req.questionSetMap = questionSetMap;
      req.questionSetThemeMap = questionSetThemeMap;

      next()
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: 'could not fetch the question sets'
      })
    })
}

exports.fetchQuestions = (req, res, next) => {
  let questionMap = new Map();
  let questionQuestionSetMap = new Map();

  Question.findAll({
      attributes: ['id', 'question', 'value', 'label', 'questionsetId'],
      order: [
        ['id', 'ASC']
      ],
    })
    .then((questionsObj) => {
      let optionMap = new Map();
      req.keys = [];

      for (let index = 0; index < questionsObj.length; index++) {

        let questionReceived = questionsObj[index].dataValues;
        let questionId = questionReceived.id;
        let questionSetId = questionReceived.questionsetId;

        let innerLoopLength = questionReceived.value.length;
        let optionsArr = [];

        for (let innerIndex = 0; innerIndex < innerLoopLength; innerIndex++) {
          let optionsElement = {
            value: questionReceived.value[innerIndex],
            label: questionReceived.label[innerIndex],
            responses: [],
          };

          optionsArr.push(optionsElement);
          let key = [questionId, questionReceived.value[innerIndex]];
          req.keys.push(key);
          optionMap.set(key, innerIndex);
        }

        let questionSetMap = req.questionSetMap;
        let questionSetThemeMap = req.questionSetThemeMap
        let themeMap = req.themeMap;
        let questionSetIndex = questionSetMap.get(questionSetId);
        let themeId = questionSetThemeMap.get(questionSetId);
        let themeIndex = themeMap.get(themeId);

        let questionIndex = req.themes[themeIndex].questionSets[questionSetIndex].questions.push({
          id: questionId,
          question: questionReceived.question,
          options: optionsArr
        }) - 1;
        questionQuestionSetMap.set(questionId, questionSetId);
        questionMap.set(questionId, questionIndex);
        req.questionMap = questionMap;
        req.questionQuestionSetMap = questionQuestionSetMap;
        req.optionMap = optionMap;
      }
      next();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: 'could not fetch the questions and/or responses'
      })
    })
}

exports.fetchResponsesAndSendToClient = (req, res) => {
  let promiseList = [];
  Resp.findAll({
      attributes: ['id', 'response', 'optResponse', 'anonymous', 'questionId'],
      order: [
        ['id', 'ASC']
      ],
    })
    .then((responses) => {
      for (index = 0; index < responses.length; index++) {
        let response = responses[index].dataValues;
        let questionId = response.questionId;
        let employeeName;
        let employeeId;
        let managerName;

        let promise = ResponseSet.findOne({
            attributes: ['surveyId'],
            include: [{
              model: Resp,
              where: {
                id: response.id
              },
              required: true,
            }]
          })
          .then((responseSet) => {
            let surveyId = responseSet.dataValues.surveyId;
            return Survey.findOne({
              attribures: ['employeeId'],
              include: [{
                model: ResponseSet,
                where: {
                  surveyId: surveyId
                },
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
                where: {
                  employeeId: employeeId
                },
                required: true,
              }]
            })
          })
          .then((employee) => {
            employeeName = (employee.dataValues.firstName + " " + employee.dataValues.lastName);
            let managerId = employee.dataValues.managerId;
            if (managerId !== null) {
              return Employee.findOne({
                attributes: ['firstName', 'lastName'],
                where: {
                  id: employee.dataValues.managerId
                },
              })
            }
            return null;
          })
          .then((manager) => {
            if (manager !== null) {
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

            let questionMap = req.questionMap;
            let questionQuestionSetMap = req.questionQuestionSetMap;
            let questionSetThemeMap = req.questionSetThemeMap;
            let questionSetMap = req.questionSetMap;
            let themeMap = req.themeMap;
            let optionMap = req.optionMap;
            let responseValue = response.response;
            let key = [];

            for (let i = 0; i < req.keys.length; i++) {
              [value1, value2] = req.keys[i];
              if (value1 === questionId && value2 === responseValue) {
                key = req.keys[i];
                break;
              }
            }

            let themeIndex = themeMap.get(questionSetThemeMap.get(questionQuestionSetMap.get(questionId)));
            let questionSetIndex = questionSetMap.get(questionQuestionSetMap.get(questionId));
            let questionIndex = questionMap.get(questionId);
            let optionIndex = optionMap.get(key);

            req.themes[themeIndex].questionSets[questionSetIndex].questions[questionIndex].options[optionIndex].responses.push(finalResponseObj);

            return;
          })

        promiseList.push(promise);
      }
      return Promise.all(promiseList);
    })
    .then(() => {
      let finalClientObj = req.themes;
      res.status(200).send(finalClientObj);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: 'could not fetch the questions and/or responses'
      })
    })
}

/*
    DO NOT DELETE THE COMMENTED OUT SECTION BELOW
    THE CODE STILL MIGHT BE USEFUL
*/

// // fetch question set data
// exports.fetchQuestionSetData = (req, res) => {
//   let questionSetData = {name: '', questions: []};
//   let questionMap = new Map();
//   let questionOptionsArrMap = [];
//   let questionSetId;
//   // get question set
//   QuestionSet.findOne({
//     attributes: ['id', 'name'],
//     where: {
//       name: req.body.name,
//     }
//   })
//   .then((questionSet) => {
//     // get question set id associated with the pending survey
//     questionSetId = questionSet.dataValues.id;
//     // get the questions that belong to the question set
//     return Question.findAll({
//       attributes: ['id', 'question', 'value', 'label'],
//       include: [{
//         attributes: ['id'],
//         model: QuestionSet,
//         where: {id: questionSetId},
//         required: true
//       }],
//       order: [
//         ['id', 'ASC']
//       ],
//     })
//   })
//   .then((questionsObj) => {
//     let promiseList = [];
//     for(let index = 0; index < questionsObj.length; index++) {
//       let questionReceived = questionsObj[index].dataValues;
//       let questionId = questionReceived.id;

//       questionMap.set(questionId, index);

//       let optionsArr = [];

//       let innerLoopLength = questionReceived.value.length;
//       let newMap = new Map();
//       for(let indexInnerLoop = 0; indexInnerLoop < innerLoopLength; indexInnerLoop++) {
//         let optionsElement = {
//           value: questionReceived.value[indexInnerLoop],
//           label: questionReceived.label[indexInnerLoop],
//           responses: [],
//         };
//         optionsArr.push(optionsElement);
//         newMap.set(questionReceived.value[indexInnerLoop], indexInnerLoop);
//       }
//       questionOptionsArrMap.push(newMap);
//       questionSetData.questions.push({question: questionReceived.question, options: optionsArr});

//       let promise = Resp.findAll({
//         attributes: ['id', 'response', 'optResponse', 'anonymous', 'questionId'],
//         where: {questionId: questionId},
//       });

//       promiseList.push(promise);
//     }
//     return Promise.all(promiseList);
//   })
//   .then((responsesObj) => {
//     let promiseList = [];

//     for(index = 0; index < responsesObj.length; index++) {
//       for(innerIndex = 0; innerIndex < responsesObj[index].length; innerIndex++) {
//         let response = responsesObj[index][innerIndex].dataValues;
//         let questionId = response.questionId;
//         let employeeName;
//         let employeeId;
//         let managerName;

//         let promise = ResponseSet.findOne({
//           attributes: ['surveyId'],
//           include: [{
//             model: Resp,
//             where: {id: response.id},
//             required: true,
//           }]
//         })
//         .then((responseSet) => {
//           let surveyId = responseSet.dataValues.surveyId;
//           return Survey.findOne({
//             attribures: ['employeeId'],
//             include: [{
//               model: ResponseSet,
//               where: {surveyId: surveyId},
//               required: true,
//             }]
//           })
//         })
//         .then((survey) => {
//           employeeId = survey.dataValues.employeeId;
//           return Employee.findOne({
//             attributes: ['firstName', 'lastName', 'managerId'],
//             include: [{
//               model: Survey,
//               where: {employeeId: employeeId},
//               required: true,
//             }]
//           })
//         })
//         .then((employee) => {
//           //console.log(employee)
//           employeeName = (employee.dataValues.firstName + " " + employee.dataValues.lastName);
//           let managerId = employee.dataValues.managerId;
//           if(managerId !== null) {
//             return Employee.findOne({
//               attributes: ['firstName', 'lastName'],
//               where: {id: employee.dataValues.managerId},
//             })
//           }
//           return null;
//         })
//         .then((manager) => {
//           if(manager !== null) {
//             managerName = (manager.dataValues.firstName + " " + manager.dataValues.lastName);
//           } else {
//             managerName = 'No manager';
//           }

//           let finalResponseObj = {
//             userInputText: response.optResponse,
//             authorId: employeeId,
//             authorName: employeeName,
//             managerName: managerName,
//             anonymous: response.anonymous,
//           }

//           let responseValue = questionSetData.questions[questionMap.get(questionId)].options[index].value;
//           let questionIndex = questionMap.get(questionId);
//           let optionIndex = questionOptionsArrMap[questionMap.get(questionId)].get(responseValue);
//           questionSetData.questions[questionIndex].options[optionIndex].responses.push(finalResponseObj);
//           return;
//         })
//         promiseList.push(promise);
//       }
//     }
//     return Promise.all(promiseList);
//   })
//   .then(() => {
//     questionSetData.name = req.body.name;
//     res.status(200).send(questionSetData);
//   })
//   .catch((error) => {
//     console.log(error);
//   })
// };
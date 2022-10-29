const db = require("../models");
const Employee = db.employees;
const QuestionSet = db.questionsets;
const Question = db.questions;
const Resp = db.responses;
const ResponseSet = db.responsesets;
const Survey = db.surveys;
const Theme = db.themes;

exports.prepareThemes = (req, res, next) => {
  req.themes = [];
  let themeMap = new Map();
  let map = new Map();

  Theme.findAll({
    attributes: ["id", "name"],
    order: [["id", "ASC"]],
  })
    .then((themes) => {
      for (let index = 0; index < themes.length; index++) {
        let themeReceived = themes[index].dataValues;
        let themeId = themeReceived.id;
        let themeName = themeReceived.name;

        req.themes.push({
          id: themeId,
          name: themeName,
          questionSets: [],
        });

        themeMap.set(themeId, index);
        map.set(themeId, [0, 0]);
      }
      req.themeData = map;
      req.themeMap = themeMap;
      next();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: "could not fetch any themes",
      });
    });
};

exports.prepareQuestionSets = (req, res, next) => {
  let questionSetMap = new Map();
  let questionSetThemeMap = new Map();
  let map = new Map();

  QuestionSet.findAll({
    attributes: ["id", "name", "themeId"],
    order: [["id", "ASC"]],
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
        };

        let questionSetIndex =
          req.themes[themeIndex].questionSets.push(questionSetObj) - 1;
        questionSetMap.set(questionSetId, questionSetIndex);
        questionSetThemeMap.set(questionSetId, themeId);
        map.set(questionSetId, [0, 0]);
      }
      req.questionSetData = map;
      req.questionSetMap = questionSetMap;
      req.questionSetThemeMap = questionSetThemeMap;

      next();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: "could not fetch the question sets",
      });
    });
};

exports.prepareQuestions = (req, res, next) => {
  let questionMap = new Map();
  let questionQuestionSetMap = new Map();
  let optionMap = new Map();
  let map = new Map();

  Question.findAll({
    attributes: ["id", "question", "value", "label", "questionsetId"],
    order: [["id", "ASC"]],
  })
    .then((questionsObj) => {
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
        let questionSetThemeMap = req.questionSetThemeMap;
        let themeMap = req.themeMap;
        let questionSetIndex = questionSetMap.get(questionSetId);
        let themeId = questionSetThemeMap.get(questionSetId);
        let themeIndex = themeMap.get(themeId);

        let questionIndex =
          req.themes[themeIndex].questionSets[questionSetIndex].questions.push({
            id: questionId,
            question: questionReceived.question,
            options: optionsArr,
          }) - 1;

        questionQuestionSetMap.set(questionId, questionSetId);
        questionMap.set(questionId, questionIndex);
        map.set(questionId, [0, 0]);
      }
      req.questionData = map;
      req.questionMap = questionMap;
      req.questionQuestionSetMap = questionQuestionSetMap;
      req.optionMap = optionMap;
      next();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: "could not fetch the questions and/or responses",
      });
    });
};

exports.prepareResponses = (req, res, next) => {
  let promiseList = [];

  Resp.findAll({
    attributes: ["id", "response", "optResponse", "anonymous", "questionId", "employeeId"],
    order: [["id", "ASC"]],
  })
    .then((responses) => {
      for (index = 0; index < responses.length; index++) {
        let response = responses[index].dataValues;
        let questionId = response.questionId;
        let employeeId = response.employeeId;
        let employeeName;
        let managerName;

        let promise = Employee.findOne({
              attributes: ["firstName", "lastName", "managerId"],
          })
          .then((employee) => {
            employeeName =
              employee.dataValues.firstName +
              " " +
              employee.dataValues.lastName;
            let managerId = employee.dataValues.managerId;
            if (managerId !== null) {
              return Employee.findOne({
                attributes: ["firstName", "lastName"],
                where: {
                  id: employee.dataValues.managerId,
                },
              });
            }
            return null;
          })
          .then((manager) => {
            if (manager !== null) {
              managerName =
                manager.dataValues.firstName +
                " " +
                manager.dataValues.lastName;
            } else {
              managerName = "No manager";
            }

            let finalResponseObj = {
              userInputText: response.optResponse,
              authorId: employeeId,
              authorName: employeeName,
              managerName: managerName,
              anonymous: response.anonymous,
            };

            let questionMap = req.questionMap;
            let questionQuestionSetMap = req.questionQuestionSetMap;
            let questionSetThemeMap = req.questionSetThemeMap;
            let questionSetMap = req.questionSetMap;
            let themeMap = req.themeMap;
            let optionMap = req.optionMap;
            let responseVal = response.response;
            let key = [];

            for (let i = 0; i < req.keys.length; i++) {
              [value1, value2] = req.keys[i];
              if (value1 === questionId && value2 === responseVal) {
                key = req.keys[i];
                break;
              }
            }

            let themeIndex = themeMap.get(
              questionSetThemeMap.get(questionQuestionSetMap.get(questionId))
            );
            let questionSetIndex = questionSetMap.get(
              questionQuestionSetMap.get(questionId)
            );
            let questionIndex = questionMap.get(questionId);
            let optionIndex = optionMap.get(key);
            console.log(questionId + " " + questionSetIndex)
            req.themes[themeIndex].questionSets[questionSetIndex].questions[
              questionIndex
            ].options[optionIndex].responses.push(finalResponseObj);

            const Scale = 10; // this is the scale all of the scores will be based on no matter their potential maximum value
            let maxValue =
              req.themes[themeIndex].questionSets[questionSetIndex].questions[
                questionIndex
              ].options.length;
            let multiplier = Scale / (maxValue - 1);
            responseVal = Number(responseVal);

            let [questionSum, questionTotalResponses] =
              req.questionData.get(questionId);
            questionSum += (responseVal - 1) * multiplier;
            questionTotalResponses++;
            req.questionData.set(questionId, [
              questionSum,
              questionTotalResponses,
            ]);

            let [questionSetSum, questionSetTotalResponses] =
              req.questionSetData.get(questionQuestionSetMap.get(questionId));
            questionSetSum += (responseVal - 1) * multiplier;
            questionSetTotalResponses++;
            req.questionSetData.set(questionQuestionSetMap.get(questionId), [
              questionSetSum,
              questionSetTotalResponses,
            ]);

            let [themeSum, themeTotalResponses] = req.themeData.get(
              questionSetThemeMap.get(questionQuestionSetMap.get(questionId))
            );
            themeSum += (responseVal - 1) * multiplier;
            themeTotalResponses++;
            req.themeData.set(
              questionSetThemeMap.get(questionQuestionSetMap.get(questionId)),
              [themeSum, themeTotalResponses]
            );

            return;
          });

        promiseList.push(promise);
      }
      return Promise.all(promiseList);
    })
    .then(() => {
      next();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: "could not fetch the questions and/or responses",
      });
    });
};

exports.calculateScores = (req, res, next) => {
  for (let [key, value] of req.questionData) {
    let [numerator, denominator] = value;
    let score = numerator / denominator;
    let questionIndex = req.questionMap.get(key);
    let questionSetIndex = req.questionSetMap.get(
      req.questionQuestionSetMap.get(key)
    );
    let themeIndex = req.themeMap.get(
      req.questionSetThemeMap.get(req.questionQuestionSetMap.get(key))
    );

    req.themes[themeIndex].questionSets[questionSetIndex].questions[
      questionIndex
    ].score = score;
  }

  for (let [key, value] of req.questionSetData) {
    let [numerator, denominator] = value;
    let score = numerator / denominator;
    let questionSetIndex = req.questionSetMap.get(key);
    let themeIndex = req.themeMap.get(req.questionSetThemeMap.get(key));

    req.themes[themeIndex].questionSets[questionSetIndex].score = score;
  }

  for (let [key, value] of req.themeData) {
    let [numerator, denominator] = value;
    let score = numerator / denominator;
    let themeIndex = req.themeMap.get(key);

    req.themes[themeIndex].score = score;
  }

  next();
};

const buildAnalyticsReport = {
  prepareThemes: this.prepareThemes,
  prepareQuestionSets: this.prepareQuestionSets,
  prepareQuestions: this.prepareQuestions,
  prepareResponses: this.prepareResponses,
  calculateScores: this.calculateScores,
};

module.exports = buildAnalyticsReport;

const db = require("../models");
const QuestionSet = db.questionsets;
const Question = db.questions;

exports.getQuestionSets = (req, res) => {
  let questionSetList = [];
  let questionSetToIndexMap = new Map();
  QuestionSet.findAll({
      attributes: ['id', 'name', 'themeId'],
      order: [
        ['id', 'ASC']
      ],
    })
    .then((questionSets) => {
      let promiseList = [];
      for (let index = 0; index < questionSets.length; index++) {
        let questionSetReceived = questionSets[index].dataValues;
        let questionSetObj = {
          id: questionSetReceived.id,
          name: questionSetReceived.name,
          themeId: questionSetReceived.themeId,
          questions: [],
        }
        questionSetToIndexMap.set(questionSetReceived.id, index);
        questionSetList.push(questionSetObj)

        let promise = Question.findAll({
          attributes: ['id', 'question', 'value', 'label', 'questionsetId'],
          order: [
            ['id', 'ASC']
          ],
        })
        promiseList.push(promise);
      }
      return Promise.all(promiseList);
    })
    .then((questions) => {
      console.log(questions[0].dataValues)
      for (let index = 0; index < questions.length; index++) {
        let questionReceived = questions[index].dataValues;
        let optionsArr = [];

        let loopLength = questionReceived.value.length;
        for (let innerIndex = 0; innerIndex < loopLength; innerIndex++) {
          let optionsElement = {
            value: questionReceived.value[innerIndex],
            label: questionReceived.label[innerIndex],
          };
          optionsArr.push(optionsElement);
        }
        const questionObj = {
          id: questionReceived.id,
          question: questionReceived.question,
          options: optionsArr,
        }
        questionSetList[questionSetToIndexMap.get(questionReceived.questionsetId)].questions.push(questionObj);
      }
      res.status(200).send(questionSetList);
    })
    .catch(err => {
      console.log(err);

      res.status(500).send({
        message: err.message
      });
    });
};

exports.getQuestionSet = (req, res) => {
  let questionSetObj = {};
  QuestionSet.findOne({
      attributes: ['id', 'name', 'themeId'],
      where: {
        id: req.params.id
      },
    })
    .then((questionSet) => {
      questionSetObj = {
        id: questionSet.id,
        name: questionSet.name,
        themeId: questionSet.themeId,
        questions: [],
      }

      return Question.findAll({
        attributes: ['id', 'question', 'value', 'label', 'questionsetId'],
        order: [
          ['id', 'ASC']
        ],
      })
    })
    .then((questions) => {
      for (let index = 0; index < questions.length; index++) {
        let questionReceived = questions[index].dataValues;
        let optionsArr = [];

        let loopLength = questionReceived.value.length;
        for (let innerIndex = 0; innerIndex < loopLength; innerIndex++) {
          let optionsElement = {
            value: questionReceived.value[innerIndex],
            label: questionReceived.label[innerIndex],
          };
          optionsArr.push(optionsElement);
        }
        const questionObj = {
          id: questionReceived.id,
          question: questionReceived.question,
          options: optionsArr,
        }
        questionSetObj.questions.push(questionObj);
      }
      res.status(200).send(questionSetObj);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};

exports.createQuestionSet = (req, res) => {
  let setName = req.body.questionSetName;
  let employmentRole = req.body.employmentRole;
  let themeId = req.body.themeId;

  QuestionSet.create({
      name: setName,
      employmentRole: employmentRole,
      themeId: themeId,
    })
    .then((questionSet) => {
      let questionSetId = questionSet.id;
      let promiseList = [];
      for(let index = 0; index < req.questions.length; index++) {
        let question = req.questions[index];

        let promise = Question.create({
          question: question.question,
          value: question.values,
          label: question.labels,
          questionsetId: questionSetId,
        })
        promiseList.push(promise);
      }
      Promise.all(promiseList);
    })
    .then(() => {
      const clientObject = {
        status: "success",
        data: null,
      };
      res.status(200).send(clientObject);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });

}
const db = require("../models");
const QuestionSet = db.questionsets;
const Question = db.questions;
const Theme = db.themes;

exports.getThemes = (req, res) => {
  Theme.findAll({
      attributes: ['id', 'name', 'description'],
      order: [
        ['id', 'ASC']
      ],
    })
    .then((themes) => {
      let themeList = [];
      for (let index = 0; index < themes.length; index++) {
        let theme = themes[index].dataValues;
        const themeObj = {
          id: theme.id,
          name: theme.name,
          description: theme.description,
        }
        themeList.push(themeObj);
      }
      res.status(200).send(themeList);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
}

exports.getTheme = (req, res) => {
  Theme.findOne({
      attributes: ['id', 'name', 'description'],
      where: {
        id: req.params.id
      },
    })
    .then((theme) => {
      const themeObj = {
        id: theme.id,
        name: theme.name,
        description: theme.description,
      }
      res.status(200).send(themeObj);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
}

exports.getThemeQuestionSet = (req, res) => {
  let questionSetObj = {};
  QuestionSet.findOne({
      attributes: ['id', 'name', 'themeId'],
      where: {
        id: req.params.questionSetId,
        themeId: req.params.id,
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
        where: {
          questionsetId: req.params.questionSetId
        },
        order: [
          ['id', 'ASC']
        ],
      })
    })
    .then((questions) => {
      for (let index = 0; index < questions.length; index++) {
        let questionReceived = questions[index].dataVaulues;
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
}

exports.getThemeQuestionSets = (req, res) => {
  let questionSetList = [];
  let questionSetToIndexMap = new Map();
  QuestionSet.findAll({
      attributes: ['id', 'name', 'themeId'],
      where: {
        themeId: req.params.id
      },
      order: [
        ['id', 'ASC']
      ],
    })
    .then((questionSets) => {
      let promiseList = [];
      let questionSetId;
      for (let index = 0; index < questionSets.length; index++) {
        let questionSetReceived = questionSets[index].dataVaulues;
        questionSetId = questionSetReceived.id;
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
          where: {
            questionsetId: questionSetId
          },
          order: [
            ['id', 'ASC']
          ],
        })
        promiseList.push(promise);
      }
      return Promise.all(promiseList);
    })
    .then((questions) => {
      for (let index = 0; index < questions.length; index++) {
        let questionReceived = questions[index].dataVaulues;
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
      res.status(500).send({
        message: err.message
      });
    });
}

exports.createTheme = (req, res) => {
  let name = req.body.name;
  let description = req.body.description;

  Theme.create({
      name: name,
      description: description,
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
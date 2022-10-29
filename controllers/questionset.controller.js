const { questionsets } = require("../models");
const db = require("../models");
const QuestionSet = db.questionsets;

exports.getQuestionSets = (req, res) => {
  QuestionSet.findAll({
    attributes: ['id', 'name', 'themeId']
  })
  .then((questionSets) => {
    let questionSetList = [];
    for(let index = 0; index < questionSets.length; index++) {
      let questionSetReceived = questionSets[index].dataVaulues;
      const questionSetObj = {
        id: questionSetReceived.id,
        name: questionSetReceived.name,
        themeId: questionSetReceived.themeId,
      }
      questionSetList.push(questionSetObj)
    }

    res.send({
      questionSets: questionSetList,
    });
  })
  .catch(err => {
    res.status(500).send({
      message: err.message
    });
  });
};

exports.getQuestionSet = (req, res) => {
  QuestionSet.findOne({
    attributes: ['id', 'name', 'themeId']
  })
  .then((questionSet) => {
    const questionSetObj = {
      id: questionSet.id,
      name: questionSet.name,
      themeId: questionSet.themeId,
    }
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

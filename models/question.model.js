module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define("question", {
      questionID: {
        type: Sequelize.INTEGER
      },
      theme: {
        type: Sequelize.STRING
      },
      employmentRole: {
        type: Sequelize.STRING
      },
      question: {
        type: Sequelize.STRING
      }
    });
  
    return Question;
  };
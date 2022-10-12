module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define("question", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      employmentRole: {
        type: Sequelize.STRING,
        allowNull: false
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    return Question;
  };
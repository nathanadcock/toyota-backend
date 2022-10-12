module.exports = (sequelize, Sequelize) => {
  const QuestionSet = sequelize.define("questionset", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    theme: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return QuestionSet;
};
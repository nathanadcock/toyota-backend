module.exports = (sequelize, Sequelize) => {
  const QuestionSet = sequelize.define("questionset", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  });

  return QuestionSet;
};
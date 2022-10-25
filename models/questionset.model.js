module.exports = (sequelize, Sequelize) => {
  const QuestionSet = sequelize.define("questionset", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    }
  });

  return QuestionSet;
};
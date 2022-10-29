const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {

    const Question = sequelize.define("question", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false
      },
      value: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['1', '2', '3', '4'],
        allowNull: false
      },
      label: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['Strongly Disagree', 'Slightly Disagree', 'Slightly Agree', 'Strongly Agree'],
        allowNull: false
      }
    });

    return Question;
  };
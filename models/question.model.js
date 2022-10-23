const { DataTypes } = require("sequelize");

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
<<<<<<< HEAD
        allowNull: true
=======
        allowNull: false
>>>>>>> f5fa73579e9155e83175ad0de6c568e608ca8186
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
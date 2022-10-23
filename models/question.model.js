const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const optionsObj = [
      {
        value: '1',
        label: 'Strongly Disagree',
      },
      {
        value: '2',
        label: 'Disagree',
      },
      {
        value: '3',
        label: 'Somewhat Disagree',
      },
      {
        value: '4',
        label: 'Somewhat Agree',
      },
      {
        value: '5',
        label: 'Agree',
      },
      {
        value: '6',
        label: 'Strongly Agree',
      },
    ];

    const optionsJSON = JSON.stringify(optionsObj);

    const Question = sequelize.define("question", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      employmentRole: {
        type: Sequelize.STRING,
        allowNull: true
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
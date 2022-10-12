
module.exports = (sequelize, Sequelize) => {

    const Survey = sequelize.define("survey", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      dateSubmitted: {
        type: Sequelize.DATE,
        allowNull: false
      },
      questionSet: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false
      },
      responseSet: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      theme: {
        type: Sequelize.STRING,
      },
    });

    return Survey;
  };

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
    });

    return Survey;
  };
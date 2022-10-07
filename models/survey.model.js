module.exports = (sequelize, Sequelize) => {
    const Survey = sequelize.define("survey", {
      surveyID: {
        type: Sequelize.INTEGER
      },
      dateSubmitted: {
        type: Sequelize.DATE
      },
      questionSet: {
        type: Sequelize.ARRAY(DataTypes.INTEGER)
      },
      responseSet: {
        type: Sequelize.ARRAY(DataTypes.INTEGER)
      }, 
      theme: {
        type: Sequelize.STRING
      },
    });
  
    return Survey;
  };

module.exports = (sequelize, Sequelize) => {

    const Survey = sequelize.define("survey", {
      surveyID: {
        type: Sequelize.INTEGER
      },
      dateSubmitted: {
        type: Sequelize.DATE
      },
      questionSet: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      responseSet: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      }, 
      theme: {
        type: Sequelize.STRING
      },
    });
  
    return Survey;
  };
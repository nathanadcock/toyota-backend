module.exports = (sequelize, Sequelize) => {
    const Response = sequelize.define("response", {
      response: {
        type: Sequelize.STRING
      },
      optResponse: {
        type: Sequelize.STRING
      }, 
      anonymous: {
        type: Sequelize.BOOLEAN
      },
    });
  
    return Response;
  };
module.exports = (sequelize, Sequelize) => {
    const Response = sequelize.define("response", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      response: {
        type: Sequelize.STRING,
        allowNull: false
      },
      optResponse: {
        type: Sequelize.STRING,
        allowNull: false
      },
      anonymous: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
    });

    return Response;
  };
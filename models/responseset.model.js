module.exports = (sequelize, Sequelize) => {
  const ResponseSet = sequelize.define("responseset", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  });

  return ResponseSet;
};
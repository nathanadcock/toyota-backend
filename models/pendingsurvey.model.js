module.exports = (sequelize, Sequelize) => {
  const PendingSurvey = sequelize.define("pendingsurvey", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  });

  return PendingSurvey;
};
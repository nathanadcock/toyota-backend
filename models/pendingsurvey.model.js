module.exports = (sequelize, Sequelize) => {
  const PendingSurvey = sequelize.define("pending_survey", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  });

  return PendingSurvey;
};
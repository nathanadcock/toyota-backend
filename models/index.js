const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    //operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//finish setting this part up, add the foreign keys
db.employees = require("./employee.model.js")(sequelize, Sequelize)
db.surveys = require("./survey.model.js")(sequelize, Sequelize)
db.questions = require("./question.model.js")(sequelize, Sequelize)
db.responses = require("./response.model.js")(sequelize, Sequelize)
db.questionsets = require("./questionset.model.js")(sequelize, Sequelize)
db.responsesets = require("./responseset.model.js")(sequelize, Sequelize)

db.employees.hasMany(db.surveys);
db.surveys.belongsTo(db.employees, {
  foreignKey: {
    allowNull: false
  }
});

db.questionsets.hasMany(db.questions);
db.questions.belongsTo(db.questionsets, {
  foreignKey: {
    allowNull: false
  }
});

db.questionsets.hasMany(db.surveys);
db.surveys.belongsTo(db.questionsets, {
  foreignKey: {
    allowNull: false
  }
});

db.questions.hasMany(db.responses);
db.responses.belongsTo(db.questions, {
  foreignKey: {
    allowNull: false
  }
});

db.questionsets.hasMany(db.responsesets);
db.responsesets.belongsTo(db.questionsets, {
  foreignKey: {
    allowNull: false
  }
})

db.surveys.hasOne(db.responsesets);
db.responsesets.belongsTo(db.surveys);

module.exports = db;

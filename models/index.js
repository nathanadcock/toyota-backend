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
db.pendingsurveys = require("./pendingsurvey.model.js")(sequelize, Sequelize)
db.themes = require("./theme.model.js")(sequelize, Sequelize)

//all associations are defined below
db.employees.hasMany(db.surveys);
db.surveys.belongsTo(db.employees, {
  foreignKey: {
    allowNull: false
  }
});

db.themes.hasMany(db.questionsets);
db.questionsets.belongsTo(db.themes, {
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

db.responsesets.hasMany(db.responses);
db.responses.belongsTo(db.responsesets, {
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

db.employees.hasMany(db.responses);
db.responses.belongsTo(db.employees, {
  foreignKey: {
    allowNull: false
  }
});

db.questionsets.hasMany(db.responsesets);
db.responsesets.belongsTo(db.questionsets, {
  foreignKey: {
    allowNull: false
  }
});

db.employees.belongsToMany(db.questionsets, { through: db.pendingsurveys });
db.questionsets.belongsToMany(db.employees, { through: db.pendingsurveys });

db.surveys.hasOne(db.responsesets);
db.responsesets.belongsTo(db.surveys, {
  foreignKey: {
    allowNull: false
  }
});

module.exports = db;

const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

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

db.employees.hasMany(db.surveys, { as: "surveys" });
db.surveys.belongsTo(db.employees, {
  foreignKey: "employeeID",
  as: "employee",
});

db.questions.hasMany(db.responses, { as: "responses" });
db.responses.belongsTo(db.questions, {
  foreignKey: "questionID",
  as: "question",
});

module.exports = db;

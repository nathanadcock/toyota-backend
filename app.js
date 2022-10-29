const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var bcrypt = require("bcryptjs");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:4200"
// };

// app.use(cors(corsOptions));
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// add routes from routes folder
require("./routes/auth.routes")(app);
require("./routes/users.routes")(app);
require("./routes/managers.routes")(app);
require("./routes/surveys.routes")(app);
require("./routes/pendingsurveys.routes")(app);
require("./routes/questionsets.routes")(app);
//require('./routes/analytics.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./models");
const Question = db.questions;
const QuestionSet = db.questionsets;
const Employee = db.employees;
const Theme = db.themes;
const PendingSurvey = db.pendingsurveys;

//sync to database
db.sequelize
  .sync({
    force: true,
  })
  .then(() => {
    console.log("Drop and Resync Db");
    //authenticate db
    return db.sequelize.authenticate();
  })
  .then(() => {
    console.log("database successfully authenticated!");
    return Theme.create({
      name: "Alignment",
    })
      .then(() => {
        return QuestionSet.create({
          name: "Question Set 1",
          themeId: 1,
        });
      })
      .then(() => {
        Question.create({
          employmentRole: "Manager",
          question: "You are motivated by your organization's values.",
          questionsetId: 1,
        });
        Question.create({
          employmentRole: "Manager",
          question:
            "The leaders of your organization demonstrate that employees are essential to its success.",
          questionsetId: 1,
        });
        return Question.create({
          employmentRole: "Manager",
          question:
            "You believe that your organization is able to reach its objectives.",
          questionsetId: 1,
        });
      })
      .then(() => {
        return QuestionSet.create({
          name: "Question Set 2",
          themeId: 1,
        });
      })
      .then(() => {
        Question.create({
          employmentRole: "Manager",
          question:
            "Your organization invest an amount of resources, people and efforts that measures up to its ambitions.",
          questionsetId: 2,
        });
        Question.create({
          employmentRole: "Manager",
          question:
            "I am inspired by the purpose and mission of my organization.",
          questionsetId: 2,
        });
        return Question.create({
          employmentRole: "Manager",
          question: "Your organization involved in its community.",
          questionsetId: 2,
        });
      })
      .then(() => {
        Employee.create({
          firstName: "Bob",
          lastName: "Bob",
          email: "bob@gmail.com",
          managerId: 10,
          employmentRole: "Contractor",
          departmentID: 20,
          password: bcrypt.hashSync("testpass123!", 8),
        });
        return Employee.create({
          firstName: "Nathan",
          lastName: "Adcock",
          email: "nate@gmail.com",
          managerId: 25,
          employmentRole: "Manager",
          departmentID: 45,
          password: bcrypt.hashSync("pass", 8),
        });
      })
      .then(() => {
        return PendingSurvey.create({
          employeeId: 2,
          questionsetId: 1,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

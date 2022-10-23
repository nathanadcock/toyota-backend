
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var bcrypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// add routes from routes folder
require('./routes/auth.routes')(app);
require('./routes/survey.routes')(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./models");
const Response = db.responses;
const Question = db.questions;
const QuestionSet = db.questionsets;
const Employee = db.employees;
const Theme = db.themes;
const PendingSurvey = db.pendingsurveys;

//sync to database
db.sequelize.sync({force: true})
  .then(() => {
    console.log('Drop and Resync Db');
  //authenticate db
    return db.sequelize.authenticate()
  })
  .then(() => {
    console.log("database successfully authenticated!")
    return Theme.create({name: 'something'})
  .then(() => {
    return QuestionSet.create({themeId: 1})
  })
  .then(() => {
    Question.create({employmentRole: 'Manager', question: "You are motivated by your organization's values.", questionsetId: 1})
    Question.create({employmentRole: 'Manager', question: "Your organization is involved in its community.", questionsetId: 1})
    return Question.create({employmentRole: 'Manager', question: "Your organization allows you to provide feedback.", questionsetId: 1})
  })
  .then(() => {
<<<<<<< HEAD
    Response.create({response: '2', optResponse: 'nothing', anonymous: true, questionId: 1})
    Employee.create({firstName: 'Bob', lastName: 'Bob', email: "bob@gmail.com", managerId: 10, employmentRole: "Contractor", departmentID: 20, password: bcrypt.hashSync('testpass123!', 8)})
=======
>>>>>>> f5fa73579e9155e83175ad0de6c568e608ca8186
    return Employee.create({firstName: 'Nathan', lastName: 'Adcock', email: "nate@gmail.com", managerId: 25, employmentRole: "Manager", departmentID: 45, password: bcrypt.hashSync('pass', 8)})
  })
  .then(() => {
    return PendingSurvey.create({employeeId: 2, questionsetId: 1})
  })
  .catch(err => {
    console.log(err.message);
  })
})



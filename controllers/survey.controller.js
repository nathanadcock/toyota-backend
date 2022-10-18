const db = require("../models");
const Employee = db.employees;
const Survey = db.surveys;
const QuestionSet = db.questionsets;
const Question = db.questions;
const ResponeSet = db.responsesets;
const Resp = db.responses;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.fetchSurvey = (req, res) => {
  // Save Employee to Database, will probably need to update this code, not sure how registration process will work
  Employee.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    managerID: req.body.managerID,
    employmentRole: req.body.employmentRole,
    departmentID: req.body.departmentID,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
        res.send({ message: "Employee was registered successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
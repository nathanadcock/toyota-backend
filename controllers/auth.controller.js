const db = require("../models");
const config = require("../config/auth.config");
const Employee = db.employees;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
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

exports.signin = (req, res) => {
  //console.log(req.body)
  Employee.findOne({
    where: {
        email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Employee Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 43200 // 12 hours
      });

      res.status(200).send({
        id: user.id,
        email: user.email,
        managerId: user.managerID,
        employmentRole: user.employmentRole,
        accessToken: token
      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

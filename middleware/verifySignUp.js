const db = require("../models");
const Employee = db.employees;

const checkDuplicateEmail = (req, res, next) => {
  // Email
  Employee.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }
    next();
  });
};

const checkManagerExist = (req, res, next) => {
  // Email
  Employee.findOne({
    where: {
      email: req.body.managerEmail
    }
  }).then(user => {
    if (user.employmentRole !== "Executive" 
        && user.employmentRole !== "Admin" 
        && user.employmentRole !== "Manager") {
          
          res.status(403).send({
            message: "Failed! Given Manager Email is associated with non-manager employee."
          });
        } else {
          req.body.managerID = user.id;
          next();
        }
  })
  .catch(err => {
    res.status(400).json({
      message: "Failed! Could not find employee associated with that manager email!"
    });
  });
};

const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkManagerExist: checkManagerExist
};

module.exports = verifySignUp;
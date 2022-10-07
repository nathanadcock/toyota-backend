const db = require("../models");
const Employee = db.employees;

checkDuplicateEmail = (req, res, next) => { 
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

  const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail
  };
  
  module.exports = verifySignUp;
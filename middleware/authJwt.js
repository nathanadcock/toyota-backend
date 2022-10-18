const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Employee = db.employees;

//self-explanatory but this method verifies the token passed in from the client for security
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

//these two methods will probably be changed, will probably just needa method that returns the employee role, however, this code might need to be used
//on the dashboard to prevent non-admins from accessing data they shouldn't be able to access, so keep this here for that just in case
isRegular = (req, res, next) => {
  Employee.findByPk(req.userId).then(user => {
    if(user.empoloymentRoll !== "Regular")

      res.status(403).send({
        message: "Require Regular Role!"

    });
  })
  .catch(err => {
    res.status(500).json({message: 'Could not find employee.'});
  });
};

isContractor = (req, res, next) => {
  Employee.findByPk(req.employeeID).then(user => {
    if(user.empoloymentRoll !== "Contractor")

      res.status(403).send({
        message: "Require Moderator Role!"

    });
  })
  .catch(err => {
    res.status(500).json({message: 'Could not find employee.'});
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isRegular: isRegular,
  isContractor: isContractor
};
module.exports = authJwt;

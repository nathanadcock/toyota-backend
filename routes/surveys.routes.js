// const controller = require("../controllers/survey.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.get(
  //   "/api/survey/:id",
  //   [authJwt.verifyToken],
  //   controller.getSurvey
  // );

  // app.post(
  //   "/api/survey",
  //   [authJwt.verifyToken],
  //   controller.createSurvey
  // );
};
const controller = require("../controllers/survey.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/survey/fetchsurvey/:id",
    [authJwt.verifyToken],
    controller.fetchSurvey
  );

  app.post(
    "/api/survey/submitsurvey",
    [authJwt.verifyToken],
    controller.storeSurveyResults
  );
};

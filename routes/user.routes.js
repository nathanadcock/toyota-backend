const { authJwt, buildAnalyticsReport } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/users/:id/pending-surveys",
    [authJwt.verifyToken],
    controller.getUserPendingSurvey,
  );

  app.get(
    "/api/users/:id/report",
    [
      authJwt.verifyToken,
      buildAnalyticsReport.prepareThemes,
      buildAnalyticsReport.prepareQuestionSets,
      buildAnalyticsReport.prepareQuestions,
      buildAnalyticsReport.prepareResponses,
      buildAnalyticsReport.calculateScores,
    ],
    controller.getReport,
  );

  // app.get(
  //   "/api/users/:id",
  //   [verifySignUp.checkDuplicateEmail],
  //   controller.getUser,
  // );

  app.post(
    "/api/users/:id/surveys",
    [authJwt.verifyToken],
    controller.createUserSurvey,
  );

  // app.get(
  //   "/api/users",
  //   [verifySignUp.checkDuplicateEmail],
  //   controller.getUsers,
  // );
};

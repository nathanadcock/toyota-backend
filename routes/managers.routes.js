const { authJwt, buildAnalyticsReport } = require("../middleware");
const controller = require("../controllers/manager.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/managers/:id/report",
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
};

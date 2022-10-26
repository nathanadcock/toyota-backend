const controller = require("../controllers/analytics.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/analytics/getQuestionSetData",
    //[authJwt.verifyToken],
    [
      controller.fetchThemes,
      controller.fetchQuestionSets,
      controller.fetchQuestionsAndResponses,
    ],
    controller.insertResponsesIntoClientObjectAndSend,
  );
};

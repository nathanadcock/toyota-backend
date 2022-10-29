const { authJwt } = require("../middleware");
const controller = require("../controllers/questionset.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/question-sets",
    [authJwt.verifyToken],
    controller.getQuestionSets,
  );

  app.get(
    "/api/question-sets/:id",
    [authJwt.verifyToken],
    controller.getQuestionSet,
  );

  app.post(
    "/api/question-sets",
    [authJwt.verifyToken],
    controller.createQuestionSet,
  );
};

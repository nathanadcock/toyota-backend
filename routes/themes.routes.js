const { authJwt } = require("../middleware");
const controller = require("../controllers/theme.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/themes",
    [authJwt.verifyToken],
    controller.getThemes,
  );

  app.get(
    "/api/themes/:id",
    [authJwt.verifyToken],
    controller.getTheme,
  );

  app.get(
    "/api/themes/:id/question-sets",
    [authJwt.verifyToken],
    controller.getThemeQuestionSets,
  );

  app.get(
    "/api/themes/:id/question-sets/:id",
    [authJwt.verifyToken],
    controller.getThemeQuestionSet,
  );

  app.post(
    "/api/themes",
    [authJwt.verifyToken],
    controller.createTheme,
  );
};
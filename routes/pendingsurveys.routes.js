const controller = require("../controllers/pendingsurvey.controller");
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
  //   "/api/pending-surveys/:id",
  //   [authJwt.verifyToken],
  //   controller.getPendingSurvey
  // );

  // app.post(
  //   "/api/pending-surveys",
  //   [authJwt.verifyToken],
  //   controller.createPendingSurvey
  // );
};
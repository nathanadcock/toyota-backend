const db = require("../models");

exports.getReport = (req, res) => {
  const clientObject = {
    themes: req.themes,
  };

  res.status(200).send(clientObject);
};
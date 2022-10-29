exports.getReport = (req, res) => {
  const themes = req.themes;

  const clientObject = {
    themes: themes,
  };

  res.status(200).send(clientObject);
};
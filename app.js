
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// add routes in routes folder
require('./routes/auth.routes')(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./models");
const Response = db.responses;
const Question = db.questions;
const QuestionSet = db.questionsets

//sync to database
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
}).then(() => {
  //authenticate db
  db.sequelize.authenticate().then(() => {
    console.log("database successfully authenticated!")

    //this is just a test to create a row in the reponses table
    QuestionSet.create({theme: 'something'}).then(() => {
      return Question.create({employmentRole: 'Manager', question: "whats up?", qsID: 1})
    })
    .then(() => {
      return Question.create({employmentRole: 'Manager', question: "whats up?", qsID: 1})
    })
    .then(() => {
      return Response.create({response: '2', optResponse: 'nothing', anonymous: true, qID: 1})
    })
    .catch(err => {})
  })
  .catch(err => {
    console.log(err.message);
  })
})



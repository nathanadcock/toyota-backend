
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
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

//sync to database
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');

  //authenticate db
  db.sequelize.authenticate().then(() => {
    console.log("database successfully authenticated!")

    //this is just a test to create a row in the reponses table
    Question.create({employmentRole: 'Manager', question: "whats up?"}).then().catch(err => {})

    Response.create({response: '2', optResponse: 'nothing', anonymous: true, qID: 1})
    .then(
      console.log("success")
    )
    .catch(err => {
      console.log("oops")
    })
  })
  .catch(err => {
    console.log(err.message)
  })

})
.catch(err => {
  console.log(err.message);
})



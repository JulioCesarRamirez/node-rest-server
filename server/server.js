require("./config/config");

const express = require("express");
const mongoose = require("mongoose");
const colors = require("colors");

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(require("./routes/usuario"));
mongoose.connect(
  process.env.URLDB,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) throw err;
    console.log("Base de datos ONLINE!".green);
  }
);

app.listen(process.env.PORT, () => {
  console.log("Server up!!".blue, process.env.PORT.yellow);
});

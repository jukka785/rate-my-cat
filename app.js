var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var app = express();

var indexRoutes = require("./routes/index");

// configure dotenv
require("dotenv").load();

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;
const databaseUri = process.env.MONGODB_URI;
mongoose.connect(databaseUri, { useMongoClient: true })
  .then(() => {
    console.log("Database connected");
  })
  .catch(err => console.log("Database connection error: " + err.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use("/", indexRoutes);

app.listen(process.env.PORT/*, process.env.IP*/, function() {
  console.log("Server has started on port " + process.env.PORT);
});

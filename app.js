var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var localStrategy = require("passport-local");
var flash = require("connect-flash");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var app = express();

var User = require("./models/user");
var indexRoutes = require("./routes/index");
var commentRoutes = require("./routes/comments");

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
// view engine setup
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser("secret"));

app.locals.moment = require('moment');

// passport configuration
app.use(require("express-session")({
  secret: "nelli on isoluinen katti!",
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
// configure passport middleware
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in localStrategy
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// register routes
app.use("/", indexRoutes);
app.use("/cats/:id/comments", commentRoutes);

app.listen(process.env.PORT/*, process.env.IP*/, function() {
  console.log("Server has started on port " + process.env.PORT);
});

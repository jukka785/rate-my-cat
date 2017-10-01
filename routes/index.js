var express = require("express");
var router = express.Router();
var Cat = require("../models/cat");
var Comment = require("../models/comment");

// root route
router.get("/", function(req, res) {
  res.render("landing");
});

// home route
router.get("/home", function(req, res) {
  res.render("home");
});

// test db data route
router.get("/test", function(req, res) {
  Cat.find().populate("comments").exec(function(err, foundCats) {
    if (err) {
      console.dir(err);
    } else {
      res.render("test", { cats: foundCats });
    }
  });
});

module.exports = router;

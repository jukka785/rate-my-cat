var express = require("express");
var router = express.Router();
var passport = require("passport");
var Cat = require("../models/cat");
var Comment = require("../models/comment");
var User = require("../models/user");

// n items per page (for pagination)
var pageLimit = 6;

// root route
router.get("/", function(req, res) {
  res.render("landing");
});

// cats route
router.get("/cats", function(req, res) {
  Cat.count(function(err, count) {
    var currentPage = Number(req.query.page);
    var pageCount = Math.ceil(count / pageLimit);
    var currentPage = currentPage > 0 ? currentPage : 1;
    var currentPage = currentPage > pageCount ? pageCount : currentPage;
    var pagination = getPagination(currentPage, pageCount);
    Cat.list({ page: currentPage, limit: pageLimit }, function(err, foundCats) {    
      var paginationParams = { pagination: pagination, currentPage: currentPage };
      if (err || !foundCats) {
        console.log(err);
      } else {
        res.render("cats", { cats: foundCats, page: "cats", paginationParams: paginationParams });
      }
    });
  });
});

// show cat route
router.get("/cats/:id", function(req, res) {
  Cat.findByShortId({ shortid: req.params.id }, function(err, foundCat) {
    if (err || !foundCat) {
      //console.log(err);
      req.flash("error", "Sorry, that cat does not exist!");
      res.redirect("/cats");
    } else {
      res.render("show", { cat: foundCat, page: "login" });
    }    
  });
});

// login form route
router.get("/login", function(req, res) {
  res.locals.currentUser ? res.redirect("/cats") : res.render("login", { page: "login"});
});

// login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/cats",
    failureRedirect: "login",
    failureFlash: true,
    successFlash: "Welcome to Rate my cat!"
  }), function(req, res) {
});

router.get("/register", function(req, res) {
  res.locals.currentUser ? res.redirect("/cats") : res.render("register", { page: "register" });
});

router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("login", {error: err.message});
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Successfully signed up! Nice to meet you " + req.body.username);
      res.redirect("/cats");
    });
  });
});

router.get("/logout", function(req, res) {
  if (res.locals.currentUser) {
    req.logout();
    req.flash("success", "See you later!");
  } else {
    req.flash("error", "You need to be logged in to log out!");
  }
  res.redirect("/cats");
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

router.get("*", function(req, res) {
  res.redirect("/cats");
});

function getPagination(currentPage, pageCount) {
  var delta = 2;
  var left = currentPage - delta;
  var right = currentPage + delta + 1;
  var result = [];

  // magic
  result = Array.from({length: pageCount}, (v, k) => k + 1).filter(i => i && i >= left && i < right);

  return result;
}

module.exports = router;

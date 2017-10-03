var express = require("express");
var router = express.Router({ mergeParams: true });
var Cat = require("../models/cat");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var { isLoggedIn, checkUserComment } = middleware;

router.post("/", isLoggedIn, function(req, res) {
  Cat.findByShortId({ shortid: req.params.id}, function(err, foundCat) {
    if (err || !foundCat) {
      console.log(err);
      res.redirect("/cats/" + req.params.id);
    } else {
      Comment.create({ text: req.body.text }, function(err, createdComment) {
        if (err) {
          console.log(err);
        } else {
          // add username and id to comment
          createdComment.author.id = req.user._id;
          createdComment.author.username = req.user.username;
          createdComment.save();
          foundCat.comments.push(createdComment);
          foundCat.save();
          req.flash("success", "Created a comment!");
          res.redirect("/cats/" + req.params.id);
        }
      });
    }
  });
});

router.put("/:commentId", isLoggedIn, checkUserComment, function(req, res) {
  Comment.findOneAndUpdate({ shortid: req.params.commentId }, { text: req.body.text }, function(err, comment) {
    if (err || !comment) {
      console.log(err);
      res.render("/cats/" + req.params.id);
    } else {
      req.flash("success", "Comment updated!");
      res.redirect("/cats/" + req.params.id);
    }
  });
});

router.delete("/:commentId", isLoggedIn, checkUserComment, function(req, res) {
  Cat.findOneAndUpdate({ shortid: req.params.id }, {
    $pull: {
      comments: req.params.commendId
    }
  }, function(err) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      req.comment.remove(function(err) {
        if (err) {
          return redirect("back");
        }
        req.flash("error", "Comment deleted!");
        res.redirect("back");
      });
    }
  });
});

module.exports = router;

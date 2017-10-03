var Comment = require("../models/comment");

module.exports = {
  isLoggedIn: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "You must be signed in to do that!");
    res.redirect("back");
  },
  isAdmin: function(req, res, next) {
    if (req,user.isAdmin) {
      return next();
    }
    req.flash("error", "You need to be an admin to do that!");
    res.redirect("back");
  },
  checkUserComment: function(req, res, next) {
    Comment.findOne({ shortid: req.params.commentId }, function(err, foundComment) {
      if (err || !foundComment) {
        console.log(err);
        req.flash("error", "Sorry, that comment does not exist!");
        res.redirect("back");
      } else if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
        req.comment = foundComment;
        next();
      } else {
        req.flash("error", "You don't have permission to do that!");
        res.redirect("back");
      }
    });
  }
}
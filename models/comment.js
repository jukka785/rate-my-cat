var mongoose = require("mongoose");
var shortid = require("shortid");

var CommentSchema = mongoose.Schema({
  text: String,
  shortid: {
    type: String,
    default: shortid.generate,
    index: true
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Comment", CommentSchema);
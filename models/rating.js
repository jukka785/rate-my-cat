var mongoose = require("mongoose");


var RatingSchema = mongoose.Schema({
  rating: Number,
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

module.exports = mongoose.model("Rating", RatingSchema);
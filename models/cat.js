var mongoose = require("mongoose");
var shortid = require("shortid");

var CatSchema = new mongoose.Schema({
  name: String,
  age: Number,
  image: String,
  description: String,
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
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
}, {
  timestamps: true
});

// pagination & listing
CatSchema.statics.list = function(options = {}, callback) {
  var page = options.page || 0;
  var limit = options.limit || 9;
  var skip = page > 0 ? ((page - 1) * limit) : 0;
  return this
    .find()
    .populate("comments")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec(function(err, foundCats) {
      callback(err, foundCats);
    });
};

CatSchema.statics.findByShortId = function(query = {}, callback) {
  return this
    .findOne(query)
    .populate("comments")
    .exec(function(err, foundCat) {
      callback(err, foundCat)
    });
};

module.exports = mongoose.model("Cat", CatSchema);
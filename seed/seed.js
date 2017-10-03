var mongoose = require("mongoose");
var async = require("async");
//var passport = require("passport");
var Cat = require("../models/cat");
var User = require("../models/user");
var Comment = require("../models/comment");
var Rating = require("../models/rating");
var seedData = require("./seedData");
require("dotenv").load();

var users = [];
var comments = [];
var cats = [];
var ratings = [];

mongoose.Promise = global.Promise;
const databaseUri = process.env.MONGODB_URI;
mongoose.connect(databaseUri, { useMongoClient: true })
  .then(() => {
    console.log("Database connected");
    seedDB();
  })
  .catch(err => console.log("Database connection error: " + err.message));

function randomEntry(array) {
  return array[~~(Math.random() * array.length)];
}

function randomBetween(min, max) {
  return ~~(Math.random() * (max-min)) + min;
}

function removeCollection(callback, Collection) {
  Collection.remove({}, function(err) {
    console.log("collection removed");
    callback(null, "SUCCESS - collection removed");
  });
}

// register a new user with passport magic
function createUser(user, userSavedCallBack) {
  var newUser = new User({ username: user.username });
  User.register(newUser, user.password, function(err, createdUser) { 
    if (err) {
      console.log(err);
      return next(err);
    } else {
      console.log("user registered!");
      users.push(createdUser);
      userSavedCallBack();
    }
  });
}

function createComment(comment, commentSavedCallBack) {
  var randomAuthor = randomEntry(users);
  Comment.create(comment, function(err, createdComment) {
    if (err) {
      console.log(err);
    } else {
      createdComment.author.id = randomAuthor._id;
      createdComment.author.username = randomAuthor.username;
      createdComment.save();
      console.log("comment created");
      comments.push(createdComment);
      commentSavedCallBack();
    }
  });
}

function createRating(rating, ratingSavedCallBack) {
  var randomAuthor = randomEntry(users);
  Rating.create(rating, function(err, createdRating) {
    if (err) {
      console.log(err);
    } else {
      createdRating.author.id = randomAuthor._id;
      createdRating.author.username = randomAuthor.username;
      createdRating.save();
      console.log("rating created");
      ratings.push(createdRating);
      ratingSavedCallBack();
    }
  });
}

function createCat(cat, catSavedCallBack) {
  var randomAuthor = randomEntry(users);
  Cat.create(cat, function(err, createdCat) {
    if (err) {
      console.log(err);
    } else {
      createdCat.author.id = randomAuthor._id;
      createdCat.author.username = randomAuthor.username;

      // add n comments to the created cat
      // and remove those comments from array
      for (var i = 0; i < randomBetween(0, 5); i++) {
        if (comments.length) {
          var randomComment = randomEntry(comments);
          comments.splice(comments.indexOf(randomComment), 1);
          createdCat.comments.push(randomComment);
        }
      }
      // add n ratings to the created cat
      // and remove those ratings from array
      for (var i = 0; i < randomBetween(2, 10); i++) {
        if (ratings.length) {
          var randomRating = randomEntry(ratings);
          ratings.splice(ratings.indexOf(randomRating), 1);
          createdCat.ratings.push(randomRating);
        }
      }

      createdCat.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("cat created");
          catSavedCallBack();
        }
      });   
    }
  });
}

function seedDB() {
  async.series([
    // remove users collection
    function(callback) {
      removeCollection(callback, User);
    },
    // remove comments collection
    function(callback) {
      removeCollection(callback, Comment);
    },
    // remove cats collection
    function(callback) {
      removeCollection(callback, Cat);
    },
    // seeding users
    function(callback) {
      async.each(seedData.users, createUser, function(err) {
        callback(null, "SUCCESS - seed users");
      });
    },
    // seeding comments
    function(callback) {
      async.each(seedData.comments, createComment, function(err) {
        callback(null, "SUCCESS - seed comments");
      });
    },
    // seed ratings
    function(callback) {
      async.each(seedData.ratings, createRating, function(err) {
        callback(null, "SUCCESS - seed ratings");
      });
    },
    // seeding cats
    function(callback) {
      async.each(seedData.cats, createCat, function(err) {
        callback(null, "SUCCESS - seed cats");
      });
    }    
  ],
  function(err, results) {
    console.log("seeding completed");

    if (err) {
      console.log("Errors = ");
      console.dir(err);
    } else {
      console.log("Results = ");
      console.log(results);
    }

    process.exit(0);
  });
}

//module.exports = seedDB;

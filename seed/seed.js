var mongoose = require("mongoose");
var async = require("async");
var Cat = require("../models/cat");
var User = require("../models/user");
var Comment = require("../models/comment");
var seedData = require("./seedData");
require("dotenv").load();

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;
const databaseUri = process.env.MONGODB_URI;
mongoose.connect(databaseUri, { useMongoClient: true })
  .then(() => {
    console.log("Database connected");
    seedDB();
  })
  .catch(err => console.log("Database connection error: " + err.message));

var catComments = [];

// seeding users
function seedUsers(callback) {
  User.remove({}, function(err) {
    if (err) {
      console.dir(err);
    }
    async.eachSeries(
      seedData.users,
      function(user, userSavedCallBack) {
        User.create(user, function(err, createdUser) {
          if (err) {
            console.dir(err);
          }
          console.log("created user");
          userSavedCallBack();
        });
      },
      function(err) {
        if (err) {
          console.dir(err);
        }
        console.log("seeding users completed");
        callback(null, "SUCCESS - seed users");
      }
    );
  });
}

// seeding comments
function seedComments(callback) {
  Comment.remove({}, function(err) {
    if (err) {
      console.dir(err);
    }
    async.eachSeries(
      seedData.comments,
      function(comment, commentSavedCallBack) {
        User.findOne({ username: comment.author }, function(err, user) {
          if (err) {
            console.dir(err);
          }
          var newComment = { text: comment.text };
          Comment.create(newComment, function(err, createdComment) {
            if (err) {
              console.dir(err);
            }
            createdComment.author.id = user._id;
            createdComment.author.username = user.username;
            createdComment.save().then(function() {
              catComments.push(createdComment._id);
              console.log("created comment");
              commentSavedCallBack();
            });            
          });
        });
      },
      function(err) {
        console.log("seeding comments completed");
        callback(null, "SUCCESS - seed comments");
      }
    );
  });
}

// seeding cats
function seedCats(callback) {
  Cat.remove({}, function(err) {
    if (err) {
      console.dir(err);
    }
    async.eachSeries(
      seedData.cats,
      function(cat, catSavedCallBack) {
        User.findOne({ username: cat.author }, function(err, user) {
          if (err) {
            console.dir(err);
          }
          var newCat = { name: cat.name, image: cat.image, description: cat.description/*, author: author, comments: []*/ };
          Cat.create(newCat, function(err, createdCat) {
            if (err) {
              console.dir(err);
            }
            createdCat.author.id = user._id;
            createdCat.author.username = user.username;
            createdCat.save().then(function() {
              console.log("created cat");
              catSavedCallBack();
            });            
          });
        });
      },
      function(err) {
        console.log("seeding cats completed");
        callback(null, "SUCCESS - seed cats");
      }
    );
  });
}

// seeding comments for cats
function updateCatSeed(callback) {
  var i = 0;
  async.eachSeries(
    seedData.comments,
    function(comment, catCommentSavedCallBack) {
      Comment.findById(catComments[i], function(err, foundComment) {
        if (err) {
          console.dir(err);
        }
        Cat.findOne({ name: comment.cat }, function(err, cat) {
          if (err) {
            console.dir(err);
          }         
          cat.comments.push(foundComment);
          cat.save().then(function() {
            i++;
            console.log("updated cat seed");
            catCommentSavedCallBack();
          });          
        });            
      });          
    },
    function(err) {
      console.log("updating cat seed completed");
      callback(null, "SUCCESS - update cat seed");
    }
  );
}

function seedDB() {
  async.series([
    function(callback) {
      seedUsers(callback);
    },
    function(callback) {
      seedComments(callback);
    },
    function(callback) {
      seedCats(callback);
    },
    function(callback) {
      updateCatSeed(callback);
    }
  ],
  function(err, results) {
    console.log("completed");

    if (err) {
      console.log("Errors = ");
      console.log(errors);
    } else {
      console.log("Results = ");
      console.log(results);
    }

    process.exit(0);
  });
}

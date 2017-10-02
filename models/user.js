var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = mongoose.Schema({
  username: { 
    type: String,    
    index: true,
    required: [true, "Please enter a username"],
    minlength: [3, "Your username must have at least {MINLENGTH} characters"]
  },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
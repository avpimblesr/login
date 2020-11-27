require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT = 10;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'An email field is required.'],
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    required: [true, 'A password is required.'],
    minlength: 5
  },
  firstName: {
    type: String,
    required: [true, 'The first name field is required.'],
    trim: true,
    maxlength: 100
  },
  lastName: {
    type: String,
    required: [true, 'The last name field is required.'],
    trim: true,
    maxlength: 100
  },
  token: {
    type: String
  }
});

// Saving user data
userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    // Checking if password field is availabvle and modified
    bcrypt.genSalt(SALT, function (err, salt) {
      if (err) return next (err)
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)
        user.password = hash;
        next()
      });
    });
  }
  else
  {
    next();
  }
});

// For comparing the user's entered password with database during login
userSchema.methods.comparePassword = function (candidatePassword, callBack) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callBack (err);
    callBack(null, isMatch);
  });
}

// for generating token when logged in

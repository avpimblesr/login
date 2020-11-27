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
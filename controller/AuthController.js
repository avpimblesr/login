const { User } = require('../models/UserModel');

exports.RegisterUser = async (req, res) => {
  const user = new User(req.body);
  await user.save((err, doc) => {
    if (err) {
      return res.status(422).json(
        {
          errors: err
        })
    } else {
      const userData = {
        firtsName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
      }
      return res.status(200).json(
        {
          success: true,
          message: 'Successfully Signed Up',
          userData
        }
      )
    }
  });
}

exports.LoginUser = (req, res) => {
  User.findOne({ 'email': req.body.email }, (err, user) => {
    if (!user) {
      return res.status(404).json({ success: false, message: 'User email not found!' });
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        console.log(isMatch);
        // isMatch is eaither true or false
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Wrong Password!' });
        } else {
          user.generateToken((err, user) => {
            if (err) {
              return res.status(400).send({ err });
            } else {
              const data = {
                userID: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: user.token
              }
              // saving token to cookie
              res.cookie('authToken', user.token).status(200).json(
                {
                  success: true,
                  message: 'Successfully Logged In!',
                  userData: data
                })
            }
          });
        }
      });
    }
  });
}

exports.LogoutUser = (req, res) => {
  User.findByIdAndUpdate({ _id: req.user._id }, { token: '' }, (err) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).send({ success: true, message: 'Successfully Logged Out!' });
  })
}

// get authenticated user details
exports.getUserDetails = (req, res) => {
  return res.status(200).json({
    isAuthenticated: true,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
  });
}

// );

// finally in Index.js 
const app = require('express')();
require('dotenv').config();
const port = process.env.PORT || 6000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise

const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
mongoose.connect(process.env.DATABASE, mongooseOptions)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); app.listen(port, () => {
  console.log(`Server running at here ${port}`);
}); 

const { auth } = require('./middleware/auth')
const { RegisterUser, LoginUser, LogoutUser, getUserDetails } = require('./controller/AuthController'); 
app.post('/api/users/register', RegisterUser);
app.post('/api/users/login', LoginUser);
app.get('/api/users/auth', auth, getUserDetails);
app.get('/api/users/logout', auth, LogoutUser);
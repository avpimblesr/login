const app = require('express')();
require('dotenv').config();
const PORT = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Connect to the database
const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, mongooseOptions)

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());







// Start server
app.listen(PORT, () => {
  console.log(`Server running at here ${PORT}`);
});
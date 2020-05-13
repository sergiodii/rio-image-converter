'use strict'

require('dotenv').config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser());

const Router = (require('./app/start/router'))(app)

app.listen(process.env.PORT || 3000, function () {
  console.log(`App listening on port ${process.env.PORT || 3000}!`);
});
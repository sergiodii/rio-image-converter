'use strict'

require('dotenv').config();

// oi.disk().exists('image.png').then((r) => {
//   console.log('OI OI OI ', r)
// })

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser());

const Router = (require('./app/start/router'))(app)

app.listen(process.env.PORT || 3000, function () {
  console.log(`Rio image converter, listening on port ${process.env.PORT || 3000}!`);
});
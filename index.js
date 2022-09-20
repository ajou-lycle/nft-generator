const basePath = process.cwd();
const { startCreating, buildSetup } = require(`${basePath}/src/main.js`);
var express = require('express');
var app = express();
var router = require('./routers/main')(app);

var server = app.listen(3000, function () {
  buildSetup();
  console.log("Express server has started on port 3000")
});

  // (() => {
  //   buildSetup();
  //   startCreating();
  // })();

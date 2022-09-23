const basePath = process.cwd();
var express = require('express');
var app = express();
var router = require('./routers/main')(app);

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var server = app.listen(3000, function () {
  console.log("Express server has started on port 3000")
});
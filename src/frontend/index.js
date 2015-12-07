var express = require('express');
var config = require('../../config.json');

var app = express();

app.get('/', function(req, res) {
  res.send('Hello there!');
});

var server = app.listen(config.frontend.port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("listening at http://%s:%s", host, port);
})

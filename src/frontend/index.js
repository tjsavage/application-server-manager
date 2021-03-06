var express = require('express');
var config = require('../../config.json');
var githubHandler = require('../github-deployment/handler');

var app = express();

app.post(config.githubDeployment.path, function(req, res) {
  console.log("handling new github request: ", req.url.split('?').shift());
  githubHandler(req, res, function(err) {
    console.log("Error handling github request: ", err);
  });
});

app.get('/', function(req, res) {
  res.send('Hello there!');
});

var server = app.listen(config.frontend.port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("application-server-manager frontend listening at http://%s:%s", host, port);
});

process.on('exit', function() {
  server.close();
})

process.on('uncaughtException', function(e) {
  console.log("uncaught exception", e);
  server.close();
});

process.on('SIGTERM', function() {
  server.close();
});

module.exports = {
  app: app,
  githubHandler: githubHandler
}

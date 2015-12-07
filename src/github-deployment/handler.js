var http = require('http');
var createHandler = require('github-webhook-handler');

var config = require('../../config.json');

var handler = createHandler({
  path: config.githubDeployment.path,
  secret: config.githubDeployment.secret
});

handler.on('error', function(err) {
  console.error('Error: ', err.message);
});

handler.on('push', function(event) {
  console.log(event.payload);
});

module.exports = handler;

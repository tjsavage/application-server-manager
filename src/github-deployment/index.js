var http = require('http');
var createHandler = require('github-webhook-handler');

var config = require('../../config.json');

var handler = createHandler({
  path: config.githubDeployment.path,
  secret: config.githubDeployment.secret
});

http.createServer(function(req, res) {
  handler(req, res, function(err) {
    res.statusCode = 404,
    res.end('no such location');
  })
}).listen(7777);

handler.on('error', function(err) {
  console.error('Error: ', err.message);
});

handler.on('push', function(event) {
  console.log(event.payload.repository.name);
});

var http = require('http');
var createHandler = require('github-webhook-handler');

var config = require('../../config.json');

var handler = createHandler({
  path: config.githubDeployment.path,
  secret: config.githubDeployment.secret
});

var server = http.createServer(function(req, res) {
  handler(req, res, function(err) {
    res.statusCode = 404,
    res.end('no such location');
  })
}).listen(config.githubDeployment.port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("application-server-manager github-deployment listening at http://%s:%s", host, port);
});

handler.on('error', function(err) {
  console.error('Error: ', err.message);
});

handler.on('push', function(event) {
  console.log(event.payload);
});

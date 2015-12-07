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
  console.log("New push event: ", event.payload);

  for(var i = 0; i < config.applications.length; i++) {
    var app = config.applications[i];

    if (event.repository.full_name == app.repository && event.ref == app.ref) {
      console.log("Push event matches branch, updated application");
      handler.emit('pre-update-app', {
        name: app.name
      });
    }
  }

});

module.exports = handler;

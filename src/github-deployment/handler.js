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

handler.on('release', function(event) {
  console.log("New release event: ", event.payload);

  for(var i = 0; i < config.applications.length; i++) {
    var app = config.applications[i];

    if (event.payload.repository.full_name == app.repository && event.payload.action == "published") {
      handler.emit('update-app', {
        name: app.name,
        tag: event.payload.release.tag_name
      });
    }
  }

});

module.exports = handler;

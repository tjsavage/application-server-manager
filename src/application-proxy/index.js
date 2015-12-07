var httpProxy = require('http-proxy');

var config = require('../../config.json');

var router = {};
router[config.githubDeployment.domain] = 'http://127.0.0.1:' + config.githubDeployment.port;
router[config.frontend.domain] = 'http://127.0.0.1:' + config.frontend.port;

for(var i = 0; i < config.applications.length; i++) {
  var application = config.applications[i];

  router[application.domain] = 'http://127.0.0.1:' + application.port;

  if (application.domainAliases && application.domainAliases.length != 0) {
    for(var j = 0; j < application.domainAliases.length; j++) {
      router[application.domainAliases[j]] = 'http://127.0.0.1:' + application.port
    }
  }
}

console.log(router);

var proxy = httpProxy.createProxy();

var server = require('http').createServer(function(req, res) {
  console.log('application-proxy: host: ', req.headers.host);
  console.log('application-proxy: route: ', router[req.headers.host]);
  proxy.web(req, res, {
    target: router[req.headers.host]
  });
}).listen(config.proxy.port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("application-server-manager proxy listening at http://%s:%s", host, port);
});

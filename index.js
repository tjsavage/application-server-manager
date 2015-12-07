var http = require('http');
var express = require('express');
var createHandler = require('github-webhook-handler');
var exec = require('child_process').exec;

var config = require('./config.json');

require('./src/application-proxy');
var frontend = require('./src/frontend');

var runningApplications = {};

Object.keys(config.applications).forEach(function(key) {
  var app = config.applications[key];

  var child = createNewChildApplicationProcess(app);

  runningApplications[key] = child;
});

function createNewChildApplicationProcess(app) {
  var options = {
    cwd: app.path,
    env: process.env
  };

  if (app.port) {
    options.env.port = app.port;
  }

  if (typeof app.env == 'object') {
    Object.keys(app.env).forEach(function(key) {
      options.env[key] = app.env[key]
    });
  }

  var child = exec(app.start, options);
  child.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
  });
  child.stderr.on('data', function(data) {
    console.log('stdout: ' + data);
  });
  child.on('close', function(code) {
    console.log('exiting with code: ' + code);
  });
  return child;
}

frontend.githubHandler.on('update-app', function(event) {
  var appName = event.name;

  console.log("about to update app:", appName);
  exec("git pull && git checkout tags/" + event.tag, {
    cwd: app.path
  }, function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }

    if (!error) {
      var child = runningApplications[appName];
      child.kill();
      runningApplications[appName] = createNewChildApplicationProcess(config.applications[appName]);
    }
  });

});

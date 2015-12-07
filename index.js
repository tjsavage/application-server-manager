var http = require('http');
var express = require('express');
var createHandler = require('github-webhook-handler');
var exec = require('child_process').exec;

var config = require('./config.json');

require('./src/application-proxy');
var frontend = require('./src/frontend');

var runningApplications = {};

config.applications.forEach(function(app) {
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

  runningApplications[app.name] = child;
});

frontend.githubHandler.on('pre-update-app', function(event) {
  console.log("about to update app:", event.name);
});

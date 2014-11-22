'use strict';

var Package = require('../package.json');
var Stats = require('node-dogstatsd').StatsD;

exports.register = function (server, options, next) {
  var stats = options.stats || new Stats();

  server.on('response', function (request) {
    var response = request.response;

    stats.histogram('http.response.time', request.responded - request.received, 1, [
      'status:' + response.statusCode,
      'host:' + request.info.host,
    ]);
  });

  next();
  return;
};

exports.register.attributes = {
  name: Package.name,
  version: Package.version
};

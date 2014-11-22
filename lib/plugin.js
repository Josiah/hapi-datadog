'use strict';

var Package = require('../package.json');

var Plugin = exports;

Plugin.register = function (server, options, next) {
  var stats = options.stats;

  server.on('response', function (request) {
    var tags = [];

    Plugin.tagRequest(request, tags);

    stats.increment('http.response.count', 1, tags);
    stats.histogram('http.response.time', request.info.responded - request.info.received, 1, tags);
  });

  next();
  return;
};

Plugin.tagResponse = function (response, tags) {
  if (!response) {
    return;
  }

  tags.push('response:status:' + response.statusCode);
};

Plugin.tagRequest = function (request, tags) {
  if (!request) {
    return;
  }

  if (request.info) {
    tags.push('request:host:' + request.info.host);
  }

  Plugin.tagResponse(request.response, tags);
  Plugin.tagRoute(request.route, tags);
};

Plugin.tagRoute = function (route, tags) {
  if (!route) {
    return;
  }

  tags.push('route:method:' + route.method);
  tags.push('route:path:' + route.path);

  if (route.vhost) {
    tags.push('route:vhost:' + route.vhost);
  }
};

Plugin.register.attributes = {
  name: Package.name,
  version: Package.version
};

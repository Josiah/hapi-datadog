'use strict';

var Lab = require('lab');
var Code = require('code');
var Proxyquire = require('proxyquire').noPreserveCache();
var Sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var Stats = require('node-dogstatsd').StatsD;
var Plugin = require('../lib/plugin');

var lab = exports.lab = Lab.script();

lab.experiment('Plugin', function () {

  lab.test('cretes a default connection to datadog if not supplied', function (next) {
    Plugin.register(new EventEmitter(), {}, next);
  });

  lab.experiment('http metrics', function () {
    var stats;
    var server;

    lab.beforeEach(function (next) {
      stats = new Stats();
      server = new EventEmitter();

      Plugin.register(server, {stats: stats}, next);
    });

    lab.test('response time', function (next) {
      var histogram = Sinon.mock(stats)
        .expects('histogram')
        .withArgs('http.response.time');

      server.emit('response', {
        response: {
          statusCode: 200
        },
        info: {
          recieved: 0,
          responded: 100,
          host: 'foo:5000'
        }
      });

      histogram.verify;
      next();
    });
  });
});

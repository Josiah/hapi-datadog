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
        .withArgs('http.response.time', 100, 1);

      server.emit('response', {
        response: {
          statusCode: 200
        },
        info: {
          received: 0,
          responded: 100,
          host: 'foo:5000'
        }
      });

      histogram.verify;
      next();
    });
  });

  lab.experiment('tags', function () {
    lab.experiment('request', function () {
      lab.test('will handle empty values', function (next) {
        var tags = [];
        Plugin.tagRequest(null, tags);

        Code.expect(tags).to.deep.equal([]);
        next();
      });

      lab.test('route tagging', function (next) {
        var tags = [];

        Plugin.tagRequest({
          route: {
            path: '/foo/bar',
            method: 'GET',
            vhost: 'baz'
          }
        }, tags);

        Code.expect(tags).to.deep.equal([
          'route:method:GET',
          'route:path:/foo/bar',
          'route:vhost:baz'
        ]);
        next();
      });

      lab.test('route tagging (no vhost)', function (next) {
        var tags = [];

        Plugin.tagRequest({
          route: {
            path: '/foo/bar',
            method: 'GET'
          }
        }, tags);

        Code.expect(tags).to.deep.equal([
          'route:method:GET',
          'route:path:/foo/bar'
        ]);
        next();
      });
    });
  });
});

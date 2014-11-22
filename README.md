Hapi Datadog Reporter
=====================

> [hapi-datadog][1] is a [hapi][2] plugin which reports metrics and events to [DataDog][3].

:warning: This plugin is built for Hapi 8 and doesn't currently support any older versions.

:construction: This plugin is still in it's initial stages of development and shouldn't be used in production.

Installation
------------

Firstly install the node module:

```sh
npm install --save hapi-datadog
```

Then add the plugin to your server:

```js
var Hapi = require('hapi');
var HapiDatadog = require('hapi-datadog');
var StatsD = require('node-dogstatsd').StatsD;

var server = new Hapi.Server();

server.register({
  plugin: HapiDatadog,
  options: {
    stats: new StatsD(),
  }
}, function (err) {
  if (err) {
    console.error(err);
    return;
  }
});
```

:grey_exclamation: Note that you will need to have the DataDog agent installed
on your server so that stats can be reported back.

Stats collected
---------------

### Response time

The time between when the request was received and responded to.

#### Tags
- status:*{http status code}*
- host:*{http host}*


 [1]: https://github.com/Josiah/hapi-datadog
 [2]: http://hapijs.com "Hapi - Server Framework for Node.js"
 [3]: http://www.datadoghq.com "DataDog"

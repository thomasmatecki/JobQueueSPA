"use strict";

const Hapi = require("hapi");
const Vision = require('vision');
const Inert = require('inert');
const HapiReactViews = require('hapi-react-views');
const HAPIWebSocket = require('hapi-plugin-websocket');
const Jobs = require('./data/jobs.js')();
const ActionBroker = require('./actions');


require('babel-core/register')({
  presets: ['react', 'env']
});

const server = Hapi.Server({
  port: 3000,
  host: 'localhost',
});


module.exports = {

  run: async function () {

    await server.register(Vision);
    await server.register(Inert);
    await server.register(HAPIWebSocket);

    server.views({
      engines: {
        jsx: HapiReactViews
      },
      relativeTo: __dirname,
      path: 'views'
    });

    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: './assets',
          index: false
        }
      }
    });

    server.route({
          method: "POST",
          path: "/action",
          config: {
            plugins: {
              websocket: {
                only: true,
                autoping: 30 * 1000,
                connect: ActionBroker.connect,
                disconnect: ActionBroker.disconnect
              }
            }
          },
          handler: ActionBroker.handle
        }
    );

    server.route({
      method: ['GET', 'POST', 'DELETE'],
      path: '/jobs',
      handler: (request, h) => Jobs[request.method](request, h)
    });

    server.route({
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        return h.view('Main');
      }
    });

    await server.start().then(() => {
      console.log("Server listening on " + server.info.uri);
    });
  }
}
;


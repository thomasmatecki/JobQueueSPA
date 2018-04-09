/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative 
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

"use strict";

const Hapi = require("hapi");
const Vision = require('vision');
const Inert = require('inert');
const HAPIWebSocket = require('hapi-plugin-websocket');
const Jobs = require('./data/jobs.js')();
const ActionBroker = require('./actions');


require('babel-core/register')({
  presets: ['react', 'env']
});

const server = Hapi.Server({
  port: 3000,
  host: '0.0.0.0',
});


module.exports = {

  run: async function () {

    await server.register(Vision);
    await server.register(Inert);
    await server.register(HAPIWebSocket);

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
      method: 'GET',
      path: '/',
      handler: {
        file: './assets/index.html'
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

    await server.start().then(() => {
      console.log("Server listening on " + server.info.uri);
    });
  }
}
;


/**
 * IonQ Programming Exercise.
 */


"use strict";

const Hapi = require("hapi");
const Path = require('path');
const Vision = require('vision');
const Inert = require('inert');
const HapiReactViews = require('hapi-react-views');
const HAPIWebSocket = require('hapi-plugin-websocket');
const WebSocket = require("ws")
const Jobs = require('./Storage.js');

/**
 * 
 */
require('babel-core/register')({
    presets: ['react', 'env']
});


/**
 * 
 */
const server = Hapi.Server({
    port: 3000,
    host: 'localhost',
});

/**
 * 
 */
async function init() {

    await server.register(Vision);
    await server.register(Inert);

    await server.register({
        plugin: HAPIWebSocket,
        options: {
            create: (wss) => {
                // HAPIWebSocket disables per-server client 
                // tracking by default and 
                wss.options.clientTracking = true;
            }
        }
    });

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
                path: 'assets',
                index: false
            }
        }
    });

    var routePeers = [];
    const SET_TIME = '@@time/set-time';
    const SUBMIT_JOB = '@@job/submit-job';

    server.route({
        method: "POST",
        path: "/ws",
        config: {
            plugins: {
                websocket: {

                    only: true,
                    autoping: 30 * 1000,
                    connect: ({
                        ctx,
                        wss,
                        ws,
                        req,
                        peers
                    }) => {
                        routePeers = peers;

                        ws.send(JSON.stringify({
                            type: SET_TIME,
                            serverTime: Date.now()
                        }));
                    },
                }
            }
        },
        handler: (request, h) => {
            return {
                at: "baz",
                seen: request.payload
            }
        }
    });



    server.route({
        method: 'POST',
        path: '/jobs',
        handler: (request, h) => {

            const newJob = Jobs.add(request.payload);

            routePeers.forEach((ws) => {
                ws.send(JSON.stringify({
                    type: SUBMIT_JOB,
                    job: newJob
                }));
            });

            return {
                status: "Ok",
                id: newJob.id
            };
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.view('Main');
        }
    });

    await server.start();

}

init();
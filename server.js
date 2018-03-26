/**
 * IonQ Programming Exercise.
 * 
 */
'use strict';

const Path = require('path');
const Vision = require('vision');
const HapiReactViews = require('hapi-react-views');
const Hapi = require("hapi");

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
const init = async () => {

    await server.register(Vision);

    server.views({
        engines: {
            jsx: HapiReactViews
        },
        relativeTo: __dirname,
        path: 'views'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.view('App');
        }
    });

    server.route({
        method: 'POST',
        path: '/api/{resource}',
        handler: (request, h) => {
            const user = request.params.resource;

            console.log(request.payload.name);
            //const obj = JSON.parse(request.payload);

            return `hello ${user}`;
        }
    });

    await server.start();
}

init();
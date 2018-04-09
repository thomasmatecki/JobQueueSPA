

/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

/**
 * HAPIWebSockets maintains an array of `peers`,
 * but on disconnect, the disconnecting peer is
 * included with ready state 3. For simplicity
 * simply keep track of sockets on connect and
 * disconnect.
 *
 * @type {Set<any>}
 */
let clients = new Set();
/**
 * Broadcast redux-style actions to maintain state
 * across all connected clients.
 *
 * @type {{ActionBroker: {...}}}
 */
ActionBroker = {

  get clientCount() {
    return clients.size;
  },

  connect: function ({peers, ws}) {
    clients.add(ws);
  },

  broadcast: function (action) {
    clients.forEach((peer) => {
      peer.send(JSON.stringify(action));
    });
  },

  handle: function (message) {

    ActionBroker.broadcast(message.payload);

    return {
      type: '@@acknowledgement',
      original: message.payload
    }
  },

  disconnect: function ({peers, ws}) {
    clients.delete(ws);
  },
};
module.exports = ActionBroker;
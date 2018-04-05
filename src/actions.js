/**
 *
 * HAPIWebSockets maintains an array of `peers`,
 * but on disconnect, the disconnecting peer is
 * included with ready state 3. For simplicity
 * simply track keep track of sockets on connect
 * and disconnect.
 * @type {Set<any>}
 */
let clients = new Set();

module.exports = {
  /**
   *
   * @type {{
 *  connect: module.exports.connect,
 *  action: module.exports.action,
 *  disconnect: module.exports.disconnect,
 *  emit: module.exports.emit
 * }}
   */
  ActionBroker: {
    get clientCount() {
      return clients.size;
    },

    connect: function ({peers, ws}) {
      clients.add(ws);
    },

    handle: function () {

    },

    disconnect: function ({peers, ws}) {
      clients.delete(ws);
    },

    emit: function (action) {
      clients.forEach((peer) => {
        peer.send(JSON.stringify(action));
      });
    }
  }
};
const {Server, WebSocket} = require('mock-websocket');
const assert = require('assert');
const {ActionBroker} = require('../src/actions');

describe('Action Broker', function () {

  const mockWSURI = 'ws://localhost:3000';
  const mockServer = new Server(mockWSURI);
  const numPeers = 4;
  const clients = [];
  const actions = [];

  describe('connect', function () {
    it('tracks all peer connections', (done) => {

      mockServer.on('connection', (event, ws) => {
        ActionBroker.connect({
          peers: mockServer.clients(),
          ws: ws
        });
      });

      Array.from(Array(4), _ => (new WebSocket(mockWSURI)))
          .forEach((socket, idx) => clients.push(socket));

      setTimeout(() => {
        assert.equal(ActionBroker.clientCount, numPeers,
            `all ${numPeers} peers are accounted for`);
        done();
      }, 100);

    });
  });

  describe('emit', function () {
    it('broadcasts to all peers',
        (done) => {

          clients.forEach((socket, idx) => socket.send = (data) => actions.push(data));

          setTimeout(() => {
            ActionBroker.emit({message: "this is just a test"});

            setTimeout(() => {
              assert.equal(actions.length, numPeers,
                  `messages were emitted on all ${numPeers} sockets`);
              mockServer.stop(done);
            }, 100);

          }, 100);
        });
  });
});
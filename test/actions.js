const {Server, WebSocket} = require('mock-websocket');
const assert = require('assert');
const ActionBroker = require('../src/actions');

describe('Action Broker', function () {

  const mockWSURI = 'ws://localhost:3000';
  let mockServer;

  before(function () {
    mockServer = new Server(mockWSURI);
  });

  after(function () {
    mockServer.stop()
  });

  const numPeers = 4;
  const clients = [];
  const _actions = [];

  describe('connect', function () {
    it('should track all peer connections', (done) => {

      mockServer.on('connection', (event, ws) => {
        ActionBroker.connect({
          peers: mockServer.clients(),
          ws: ws
        });
      });

      mockServer.on('close', (event, ws) => {
        ActionBroker.disconnect({
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

  describe('broadcast', function () {
    it('should broadcast to all peers',
        (done) => {

          clients.forEach((socket, idx) => socket.send = (data) => _actions.push(data));

          setTimeout(() => {
            ActionBroker.broadcast({message: "this is just a test"});

            setTimeout(() => {
              assert.equal(_actions.length, numPeers,
                  `messages were emitted on all ${numPeers} sockets`);

              clients.forEach((socket, idx) => socket.close());

              done();
            }, 100);

          }, 100);
        });
  });

  describe('handle', function () {

    it('should broadcast message to all peers', function () {

      const action0 = JSON.stringify({
        type: "@@queue/toggle-queue",
        status: true
      });

      ActionBroker.handle({payload: JSON.parse(action0)});

      assert.equal(
          clients.length,
          _actions.filter((action) => (action0 === action)).length,
          'number of actions broadcast is equal to number of clients'
      );
    });
  });
});
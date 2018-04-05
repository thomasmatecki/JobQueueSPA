const {Server, WebSocket} = require('mock-websocket');

const {ActionBroker} = require('../../src/actions');
const Jobs = require('../../src/data/jobs.js');

const assert = require('assert');


describe('Jobs Data', function () {

  const mockWSURI = 'ws://localhost:3000';
  const mockServer = new Server(mockWSURI);

  mockServer.on('connection', (event, ws) => {
    ActionBroker.connect({
      peers: mockServer.clients(),
      ws: ws
    });
  });

  const clientWS = new WebSocket(mockWSURI);
  const _actions = [];
  const actions = () => _actions.map(JSON.parse);
  clientWS.send = (data) => _actions.push(data);

  describe('post', function () {
    /**
     * @param payload
     * @returns {{} & {method: string, url: string, payload: {}} & {payload: *}}
     */
    const request = (payload) => Object.assign({}, {
      method: 'POST',
      url: '/jobs',
      payload: {}
    }, {payload: payload});

    it('requires a name for the job', () => {

      const {output} = Jobs.post(request({}), {});

      assert.equal(output.statusCode, 400, "returns Status code 400");

      assert.deepEqual(output.payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Missing Job Name'
      }, "returns a descriptive JSON response");

    });

    it('returns status Ok and a job ID',
        () => {
          const resp = Jobs.post(request({name: "Test Job 1"}), {});
          assert.deepEqual(resp, {statusCode: 201, id: 1});
        });

    it('increments the job ID for each new job',
        () => {

          const resp0 = Jobs.post(request({name: "Test Job 2"}), {});
          assert.deepEqual(resp0, {statusCode: 201, id: 2});

          const resp1 = Jobs.post(request({name: "Test Job 3"}), {});
          assert.deepEqual(resp1, {statusCode: 201, id: 3});

        });


    it('broadcasts job creation actions',
        () => {
          const creationActions = actions().filter(action => action.type === '@@job/submit-job');
          assert.equal(creationActions.length, 3, 'all create actions are broadcast');
        });


    it('broadcasts all completion actions',
        (done) => {

          const creationActions = actions().filter(action => action.type === '@@job/submit-job');
          const processingTime = creationActions.map(
              action => action.job.processingTime)
              .reduce((a, t) => (a + t));

          console.log(`...waiting ${processingTime}ms for jobs to complete...`);

          setTimeout(() => {

            const completionActions = actions().filter(action => action.type === '@@job/complete-job');
            assert.equal(completionActions.length, 3, 'all completion actions are broadcast');

            done()

          }, processingTime + 100);

        }).timeout(45000);
  });
});


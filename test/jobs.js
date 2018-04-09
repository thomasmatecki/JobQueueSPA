/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

const {Server, WebSocket} = require('mock-websocket');
const ActionBroker = require('../src/actions');
const Jobs = require('../src/data/jobs.js')(500, 2000);
const {SUBMIT_JOB, COMPLETE_JOB, CANCEL_JOB} = require('../src/constants');

const assert = require('assert');


/**
 * Request builder. Takes an HTTP method and returns
 * either a function that builds a request that may
 * take parameters.
 *
 * @param method literal HTTP method.
 * @returns {*}
 */
function request(method) {
  switch (method) {
    case 'POST':
      // #pass
    case 'DELETE':
      return (payload) => Object.assign({}, {
        method: method,
        url: '/jobs',
        payload: {}
      }, {payload: payload});

    case 'GET':
      return () => ({
        method: method,
        url: '/jobs'
      });
  }
}

describe('Jobs Data', function () {

  const mockWSURI = 'ws://localhost:3000';
  let clientWS;
  let mockServer;

  const _actions = [];
  const actions = () => _actions.map(JSON.parse);
  let jobCount = 0;

  before(function () {

    mockServer = new Server(mockWSURI);
    mockServer.on('connection', (event, ws) => {
      ActionBroker.connect({
        peers: mockServer.clients(),
        ws: ws
      });
    });

    clientWS = new WebSocket(mockWSURI);
    clientWS.send = (data) => _actions.push(data);
  });

  after(function () {
    clientWS.close();
    mockServer.stop();
  });


  /**
   *
   */
  describe('get', function () {

    it('should return active jobs that have been submitted', () => {

          for (; jobCount < 3; jobCount++) {
            Jobs.post(request('POST')({name: `Test Job ${jobCount}`}));
          }

          const resp = Jobs.get(request('GET')(), {});

          assert.equal(jobCount, resp.jobs.length, "all jobs are retrieved.");
        }
    );
  });

  /**
   *
   */
  describe('post', function () {


    it('should require a name for the job', () => {

      const {output} = Jobs.post(request('POST')({}), {});

      assert.equal(output.statusCode, 400, "returns Status code 400");

      assert.deepEqual(output.payload, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Missing Job Name'
      }, "returns a descriptive JSON response");

    });

    it('should return status Ok and a job ID', () => {

      const resp = Jobs.post(request('POST')({name: "Test Job"}), {});
      assert.deepEqual(resp, {message: "created", id: ++jobCount});

    });

    it('should increment the job ID for each new job', () => {

      assert.deepEqual(
          Jobs.post(request('POST')({name: "Test Job"}), {}),
          {message: "created", id: ++jobCount}
      );

      assert.deepEqual(
          Jobs.post(request('POST')({name: "Test Job"}), {}),
          {message: "created", id: ++jobCount}
      );


    });

    it('should broadcast job creation actions', () => {
      assert.equal(
          jobCount,
          actions().filter(action => action.type === SUBMIT_JOB).length,
          'all create actions are broadcast');
    });


    it('should broadcast completion actions for all submitted', (done) => {

      const processingTime = actions()
          .filter(action => action.type === SUBMIT_JOB)
          .map(action => action.job.processingTime)
          .reduce((a, t) => (a + t));

      console.log("\t...waiting for jobs to complete...");

      setTimeout(() => {

        assert.equal(
            jobCount,
            actions().filter(action => action.type === COMPLETE_JOB).length,
            'all completion actions are broadcast'
        );

        done();

      }, processingTime + 100);

    }).timeout(jobCount * 2000);

  });

  describe('delete', function () {

    let deletionCount = 0;

    it('should remove the item from queue', () => {

      for (startCount = jobCount; jobCount < startCount + 4; jobCount++) {
        let res = Jobs.post(request('POST')({name: `Test Job ${jobCount}`}));
      }

      assert.deepEqual(
          Jobs.delete(request('DELETE')(--jobCount)),
          {message: 'deleted', id: jobCount},
          'the correct job is removed'
      );
      deletionCount++;

      Jobs.delete(request('DELETE')(--jobCount));
      deletionCount++;

    });


    it('should return an error if the job has begun processing', () => {

      const {output} = Jobs.delete(request('DELETE')(--jobCount));

      assert.equal(output.statusCode, 409, "returns Status code 409");

      assert.deepEqual(output.payload, {
        statusCode: 409,
        error: 'Conflict',
        message: 'This job is already processing'
      }, "returns a descriptive JSON response");
    });

    it('should return an error if the job does not exist', () => {

      const {output} = Jobs.delete(request('DELETE')(9999));

      assert.equal(output.statusCode, 404, "returns Status code 404");

      assert.deepEqual(output.payload, {
        statusCode: 404,
        error: 'Not Found',
        message: 'job 9999 not found'
      }, "returns a descriptive JSON response");

    });

    it('should broadcast all deletion actions', () => {

      assert.equal(
          deletionCount,
          actions().filter(action => action.type === CANCEL_JOB).length,
          'the number of deletions is the same as actions'
      );

    });
  });
});

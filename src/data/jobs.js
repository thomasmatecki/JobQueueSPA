const Boom = require('boom');

const {SUBMIT_JOB, CANCEL_JOB, COMPLETE_JOB} = require('../constants');
const {ActionBroker} = require('../actions');
/**
 *
 * @type {number}
 */
let keyIdx = 0;

/**
 *
 * @type {number}
 */
let processIdx = -1;
/**
 *
 * @type {Map<any, any>}
 */
const jobs = new Map();

/**
 *
 * @param job
 */
function enqueue(job) {
  processIdx = job.id;
  //console.log(`Begin processing job ${processIdx}`);
  setTimeout(dequeueJob, job.processingTime);
}

/**
 *
 */
function dequeueJob() {

  //Set the last the `complete` flag to true
  jobs.get(processIdx).complete = true;

  //console.log(`Done processing job ${processIdx}`);

  ActionBroker.emit({
    type: COMPLETE_JOB,
    id: processIdx
  });

  const next = jobs.get(processIdx + 1);

  if (next) {
    enqueue(next);
  } else {
    processIdx = -1;
  }
}

module.exports = {
  /**
   *
   * @param request
   * @param h
   * @returns {{status: string, id: number|*}}
   */
  post: function (request, h) {

    const job = request.payload;

    if (!job.name) {
      return Boom.badRequest('Missing Job Name')
    }

    keyIdx += 1;

    job.id = keyIdx;
    job.submissionTime = (new Date()).getTime();
    job.processingTime = Math.floor(Math.random() * 14500) + 500;

    //Status flag 
    job.complete = false;

    jobs.set(keyIdx, job);

    ActionBroker.emit({
      type: SUBMIT_JOB,
      job: job
    });

    if (processIdx === -1) {
      enqueue(job);
    }

    return {
      statusCode: 201,
      id: job.id
    };

  },

  /**
   *
   * @param request
   * @param h
   * @returns {{serverTime: number, jobs: some[]}}
   */
  get: function (request, h) {
    return {
      serverTime: Date.now(),
      locked: false,
      jobs: Array.from(jobs.values()).filter(job => job.complete === false)
    };
  },

  /**
   *
   * @param request
   * @param h
   * @returns {string}
   */
  delete: function (request, h) {
    const id = request.payload;

    if (processIdx === id) {
      return Boom.conflict("This job is already processing");
    }

    jobs.delete(id);

    ActionBroker.emit({
      type: CANCEL_JOB,
      id: id
    });

    return "Ok"
  }
};
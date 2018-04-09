const Boom = require('boom');

const {SUBMIT_JOB, CANCEL_JOB, COMPLETE_JOB} = require('../constants');
const ActionBroker = require('../actions');
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
 * Begin processing the top entry in the
 * work queue.
 * @param job
 */
function enqueue(job) {
  processIdx = job.id;
  setTimeout(dequeueJob, job.processingTime);
}

/**
 * Find the next item in the work queue and
 * being processing
 */
function dequeueJob() {

  //Set the last the `complete` flag to true
  jobs.get(processIdx).complete = true;

  ActionBroker.broadcast({
    type: COMPLETE_JOB,
    id: processIdx
  });

  let next = null;

  // increment processIdx until entry is found or keyIdx is reached.
  while (!next && processIdx < keyIdx) {
    processIdx++;
    next = jobs.get(processIdx);
  }

  if (next) {
    enqueue(next);
  } else {
    processIdx = -1;
  }
}

/**
 * RESTful interface to manipulated jobs.
 * @param minProcTime
 * @param maxProcTime
 * @returns {{post: post, get: get, delete: delete}}
 */
module.exports = (minProcTime = 500, maxProcTime = 15000) => ({
  /**
   * Add a job. If not job is currently processing,
   * being processing of this job.
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
    job.processingTime = Math.floor(Math.random() * (maxProcTime - minProcTime)) + minProcTime;

    //Status flag 
    job.complete = false;

    jobs.set(keyIdx, job);

    ActionBroker.broadcast({
      type: SUBMIT_JOB,
      job: job
    });

    if (processIdx === -1) {
      enqueue(job);
    }

    return {
      message: "created",
      id: job.id
    };
  },

  /**
   * Return all jobs not completed.
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
  }
  ,

  /**
   * Delete a job, else error.
   *
   * @param request
   * @param h
   * @returns {string}
   */
  delete:
      function (request, h) {
        const id = request.payload;

        if (processIdx === id) {
          return Boom.conflict("This job is already processing");
        }

        // HTTP 404 if job doesn't (or no longer) exist(s).
        if (!jobs.delete(id)) {
          return Boom.notFound(`job ${id} not found`);
        }

        ActionBroker.broadcast({
          type: CANCEL_JOB,
          id: id
        });

        return {
          message: "deleted",
          id: id
        };
      }
});
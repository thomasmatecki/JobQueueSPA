var idx = 0;
const jobs = new Map();


module.exports.add = function (job) {
    idx += 1;
    job.id = idx
    job.timestamp = (new Date()).getTime();

    jobs.set(idx, job);

    console.log(job)

    return job;
}
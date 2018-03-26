import { AssertionError } from "assert";


const jobs = new Map();
var counter = 0;

export class Job {

  
  /**
   * 
   * @param {string} name 
   * @param {Date} submittedAt
   */
  constructor(name, submissionTime) {

    'string' === typeof name;

  }

  constructor(){

  }
}

/**
 * 
 * @param {string} name 
 * @param {Date} submittedAt 
 */
export const create = (name, submittedAt) => {
  counter++;
  jobs.set(counter, new Job(name, submittedAt));
}
import {
  combineReducers
} from 'redux';

import {
  Observable,
  TimeInterval
} from 'rxjs';



const SET_TIME = '@@time/set-time';
/**
 * 
 * @param {*} init 
 */
const Ticker = (init) => {

  const updater = Observable.timer(0, 500).timeInterval().map(
    tick => (tick.interval)
  );

  var tick = {
    last: init,
    observable: updater
  }

  updater.subscribe(val => {
    tick.last += val;
  });

  return tick;
}

const ticker = (state = Ticker(0), action) => {

  console.log(action);

  switch (action.type) {
    case SET_TIME:
      return Ticker(action.serverTime);
    default:
      return state;
  }

}

const SUBMIT_JOB = '@@job/submit-job';

/**
 * @param name
 * @returns {{type: string, job: {name: *}}}
 */
export const submitJob = name => ({
  type: SUBMIT_JOB,
  job: {
    name: name,
    timestamp: new Date()
  },
});
/**
 *
 * @param state
 * @param action
 * @returns {*}
 */

const jobs = (state = [], action) => {

  console.log(JSON.stringify(action));

  switch (action.type) {
    case SUBMIT_JOB:

      return [...state, action.job];
    default:
      return state;
  }
};

export const appState = combineReducers({
  ticker,
  jobs
}) 
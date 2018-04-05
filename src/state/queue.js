import {SUBMIT_JOB, CANCEL_JOB, COMPLETE_JOB} from '../constants';

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const queue = (state = [], action) => {

  switch (action.type) {

    case SUBMIT_JOB:
      return [...state, action.job];
    case COMPLETE_JOB:
      return state.filter(job => job.id !== action.id);
    case CANCEL_JOB:
      return state.filter(job => job.id !== action.id);
    default:
      return state;
  }
};

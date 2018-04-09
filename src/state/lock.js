import {TOGGLE_QUEUE} from "../constants";

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const locked = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_QUEUE:
      return action.status;
    default:
      return state;
  }
};

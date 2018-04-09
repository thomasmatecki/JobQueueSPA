/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

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

/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

import {combineReducers} from 'redux';
import {Ticker, ticker} from "./ticker";
import {queue} from "./queue";
import {locked} from "./lock";


export const initialState = ({jobs, serverTime, locked}) => ({
  queue: jobs,
  ticker: Ticker(serverTime)
});

export default combineReducers({
  ticker,
  queue,
  locked
});
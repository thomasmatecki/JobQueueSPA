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
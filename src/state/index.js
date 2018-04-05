import {combineReducers} from 'redux';
import {Ticker, ticker} from "./ticker";
import {queue} from "./queue";


export const initialState = ({jobs, serverTime}) => ({
  queue: jobs,
  ticker: Ticker(serverTime)
});

export default combineReducers({
  ticker,
  queue
});
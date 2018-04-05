import {SET_TIME} from '../constants';
import {Observable} from 'rxjs';
import {scan} from 'rxjs/operators';

export const Ticker = (startTime) => {

  const updateSource = Observable.timer(0, 500).timeInterval();

  const ticker = {
    observable: updateSource,
    serverTime: startTime
  };

  updateSource.pipe(
      scan((acc, tick) => acc + tick.interval, startTime)
  ).subscribe(time => {
    ticker.serverTime = time;
  });

  return ticker
};

export const ticker = (state = {}, action) => {

  switch (action.type) {
    case SET_TIME:
      return Ticker(action.serverTime);
    default:
      return state;
  }
};
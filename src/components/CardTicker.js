/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative 
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

import React, {Component} from "react";
import {CardTitle} from 'material-ui/Card';
import PropTypes from 'prop-types';
import {connect} from "react-redux";


/**
 * Continually updating timer on all job cards.
 *
 * The `ticker` prop should be an RXJS observable
 * that is used to update all CardTickers at some
 * sub-second interval.
 */
export class CardTicker extends Component {


  static propTypes = {
    submissionTime: PropTypes.number.isRequired,
    processingTime: PropTypes.number,
    ticker: PropTypes.object.isRequired,
    firstInQueue: PropTypes.bool
  };

  jobId = null;

  constructor(props) {
    super(props);

    this.state = {
      elapsed: this.props.ticker.serverTime,
    };

  }

  componentDidMount() {
    this.subscription = this.props.ticker.observable.subscribe(tick => {
      this.setState({elapsed: this.state.elapsed + tick.interval})
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  _FirstCardTicker = () => {

    if (this.props.jobId !== this.jobId) {
      this.jobId = this.props.jobId;
      this.doneTime = this.state.elapsed + this.props.processingTime;
    }

    return (
        <CardTitle
            title={`${Math.trunc((this.doneTime - this.state.elapsed) / 1000)}s remaining`}
            subtitle={'Processing Now'}>
        </CardTitle>
    );
  };

  _CardTicker = () => (
      <CardTitle
          title={`${Math.trunc((this.state.elapsed - this.props.submissionTime) / 1000)}s in queue`}
          subtitle={'Waiting to start'}>
      </CardTitle>
  );

  render = this.props.firstInQueue ? this._FirstCardTicker : this._CardTicker;
}

export const CardTickerContainer = connect(
    (state, props) => ({
      ticker: state.ticker
    }),
    (dispatch, props) => ({}),
)(CardTicker);
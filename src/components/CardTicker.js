import React, {Component} from "react";
import {CardTitle} from 'material-ui/Card';
import PropTypes from 'prop-types';
import {connect} from "react-redux";


export class CardTicker extends Component {

  static propTypes = {
    submissionTime: PropTypes.number.isRequired,
    ticker: PropTypes.object.isRequired,
    statusDescription: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      elapsed: this.props.ticker.serverTime
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

  render() {
    return (<CardTitle
        title={`${Math.trunc((this.state.elapsed - this.props.submissionTime) / 1000)}s`}
        subtitle={this.props.statusDescription}>
    </CardTitle>);
  }
}

export const CardTickerContainer = connect(
    (state, props) => ({
      ticker: state.ticker
    }),
    (dispatch, props) => ({}),
)(CardTicker);


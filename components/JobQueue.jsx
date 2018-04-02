import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import { GridList, GridTile } from 'material-ui/GridList';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';


const style = {
    TitleArea: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
    },
    Timer: {
        padding: '16px'
    }
};

class CardTicker extends Component {

    static propTypes = {
        start: PropTypes.number.isRequired,
        ticker: PropTypes.object.isRequired,
        statusDescription: PropTypes.string.isRequired
    }

    state = {
        elapsed: 0
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.ticker.subscribe(millis => {
            this.setState({ elapsed: this.state.elapsed + millis })
        });
    }

    render() {
        return (<CardTitle
            title={`${Math.trunc(this.state.elapsed / 1000)}s`}
            subtitle={this.props.statusDescription} >
        </CardTitle>);
    }
}

export const CartTickerContainer = connect(
    (state, props) => ({
        start: state.ticker.last,
        ticker: state.ticker.observable
    }),
    (dispatch, props) => ({}),
)(CardTicker);

/**
 *
 */
class JobQueue extends Component {
    render() {
        return (<div>
            {this.props.jobs.map((job, idx) => {
                return (
                    <Card key={idx}
                        expanded={true} >
                        <div style={style.TitleArea}>
                            <CardTitle
                                title={job.name}
                                subtitle={Number(idx).toString().padStart(4, '0')}
                                expandable={true} >

                            </CardTitle>
                            <CartTickerContainer
                                statusDescription="In Queue" />
                        </div>
                        <CardHeader
                            title={`Submitted: ${job.timestamp.toString()}`}
                            subtitle={`Duration: 100Ms`} />
                        <CardActions>
                        </CardActions>
                    </Card >)
            })}
        </div>);
    }
}

export const JobQueueContainer = connect(
    (state, props) => ({ jobs: state.jobs }),
    (dispatch, props) => ({}),
)(JobQueue);
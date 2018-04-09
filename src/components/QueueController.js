import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {JobSnack} from "./JobSnack";
import {JobFormContainer} from "./JobForm";

export class QueueController extends Component {

  state = {
    snackJobId: null
  };

  afterCreated = (response) => {
    this.setState({
      snackJobId: response.id
    });
  };

  handleSnackClose = (event) => {
    this.setState({
      snackJobId: null
    });
  };

  render() {
    return (
        <div>
          <Paper
              className="paper-container"
              zDepth={1}>
            <JobFormContainer afterCreated={this.afterCreated}/>
          </Paper>
          <JobSnack
              jobId={this.state.snackJobId}
              onRequestClosed={this.handleSnackClose}/>
        </div>);
  }
}




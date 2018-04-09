import React, {Component} from 'react';

import SnackBar from 'material-ui/Snackbar';
import PropTypes from 'prop-types';
import {JobCancel} from "./JobCancel";

export class JobSnack extends Component {

  static SUBMISSION_MESSAGE = (id) => `Job ${id} Submitted!`;

  static propTypes = {
    jobId: PropTypes.number,
  };

  render() {

    const jobCancel = React.createRef();

    return (
        <div>
          <SnackBar
              open={this.props.jobId !== null}
              message={JobSnack.SUBMISSION_MESSAGE(this.props.jobId)}
              action="Cancel"
              autoHideDuration={4000}
              onActionClick={() => jobCancel.current.openDialog()}/>
          <JobCancel
              ref={jobCancel}
              jobId={this.props.jobId}/>
        </div>);
  }
} 

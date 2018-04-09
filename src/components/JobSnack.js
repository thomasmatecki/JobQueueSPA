/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

import React, {Component} from 'react';

import SnackBar from 'material-ui/Snackbar';
import PropTypes from 'prop-types';
import {JobCancel} from "./JobCancel";

/**
 * Snackbar messaging indicating a job has been
 * submitted.
 */
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


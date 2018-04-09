/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative 
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import {cancelJob} from './REST';
import {JobSnack} from "./JobSnack";
import SnackBar from 'material-ui/Snackbar';


/**
 * Job Cancellation dialog. Used in snackbar
 * messaging and cancell button.
 */
export class JobCancel extends Component {

  static propTypes = {
    jobId: PropTypes.number
  };

  state = {
    open: false,
    snackOpen: false,
    snackMessage: ""
  };

  openDialog = () => {
    this.setState({open: true});
  };

  closeDialog = (result) => {


    if (result.statusCode >= 400) {

      this.setState({
        open: false,
        snackOpen: true,
        snackMessage: `Failed to cancel! ${result.message}`
      });

    } else {
      this.setState({open: false});
    }
  };

  render() {
    return (
        <div>
          <Dialog
              open={this.state.open && this.props.jobId != null}
              title={`Are You Sure You Want to Cancel Job ${this.props.jobId}?`}
              modal={true}
              actions={[
                <FlatButton
                    label="Yes"
                    primary={true}
                    onClick={() =>
                        cancelJob(this.props.jobId)
                            .then(this.closeDialog)}/>,
                <FlatButton
                    label="No"
                    primary={true}
                    onClick={this.closeDialog}/>,]
              }/>

          <SnackBar
              open={this.state.snackOpen}
              message={this.state.snackMessage}
              autoHideDuration={4000}/>
        </div>
    );
  }
}
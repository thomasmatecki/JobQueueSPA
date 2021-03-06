/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative 
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {createJob} from "./REST";


/**
 * Job Name input form.  Validates job name is present
 * and invokes RESTful interface to call backend.
 *
 * After successful POST, calls `afterCreated` to
 * perform any UI updates.
 */
class JobForm extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    afterCreated: PropTypes.func.isRequired
  };

  state = {
    jobName: "",
    errorText: "",
  };


  static handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
        <div>
          <form onSubmit={JobForm.handleSubmit}>
            <div className="input-box">
              <TextField
                  id="job-name"
                  disabled={this.props.locked}
                  errorText={this.state.errorText}
                  floatingLabelText="Job Name"
                  value={this.state.jobName}
                  onChange={(event, value) => {
                    this.setState({errorText: "", jobName: value})
                  }}
              />
            </div>
            <RaisedButton
                className="submit-button"
                type="submit"
                label="Submit"
                disabled={this.props.locked}
                primary={true}
                onClick={(event) => {

                  if (this.state.jobName.length === 0) {
                    this.setState({errorText: "Job Name is Required"});
                  } else {
                    this.props.onSubmit(this.state.jobName).then(this.props.afterCreated);
                    this.setState({jobName: ""});
                  }
                }}
            />
          </form>
        </div>);
  }
}


export const JobFormContainer = connect(
    (state, props) => ({locked: state.locked}),
    (dispatch, props) => ({
      onSubmit: createJob
    }),
)(JobForm);
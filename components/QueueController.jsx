import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';

import { submitJob } from '../model/jobs'
import { connect } from 'react-redux'

const style = {
  Container: {
    padding: 20,
    display: 'inline-block',
  },
  InputBox: {
    height: '80px'
  },
  Button: {
    float: 'right'
  }
};

export class QueueController extends Component {


  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }

  state = {
    jobName: "",
    errorText: ""
  }

  render() {
    return (
      <div>
        <Paper
          style={style.Container}
          zDepth={1} >
          <div style={style.InputBox}>
            <TextField
              id="job-name"
              errorText={this.state.errorText}
              floatingLabelText="Job Name"
              value={this.state.jobName}
              onChange={(event, value) => this.setState({ errorText: "", jobName: value })
              } />
          </div>
          <RaisedButton
            style={style.Button}
            label="Submit"
            primary={true}
            onClick={(event) => {
              if (this.state.jobName.length == 0) {
                this.setState({ errorText: "Job Name is Required" });
              } else {
                this.props.onSubmit(this.state.jobName);
                this.setState({ jobName: "" });
              }
            }} />
        </Paper>
      </div>);
  }
}


export const QueueControllerContainer = connect(
  (state, props) => ({}),
  (dispatch, props) => ({
    onSubmit: name => {

      fetch('/jobs', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name
        })
      }).then(function (response) {
        return response.json();
      }).then(function (jsonRespsonse) {
        console.log(jsonRespsonse);
      });
    }
  }),
)(QueueController)


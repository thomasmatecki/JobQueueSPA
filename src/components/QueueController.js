import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {createJob} from "./REST";

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
  };

  state = {
    jobName: "",
    errorText: ""
  };

  render() {
    return (
        <div>
          <Paper
              style={style.Container}
              zDepth={1}>
            <form action="#">
              <div style={style.InputBox}>
                <TextField
                    id="job-name"
                    errorText={this.state.errorText}
                    floatingLabelText="Job Name"
                    value={this.state.jobName}
                    onChange={(event, value) => this.setState({errorText: "", jobName: value})
                    }/>
              </div>
              <RaisedButton
                  style={style.Button}
                  type="submit"
                  label="Submit"
                  primary={true}
                  onClick={(event) => {
                    if (this.state.jobName.length === 0) {
                      this.setState({errorText: "Job Name is Required"});
                    } else {
                      this.props.onSubmit(this.state.jobName);
                      this.setState({jobName: ""});
                    }
                  }}/>
            </form>
          </Paper>
        </div>);
  }
}


export const QueueControllerContainer = connect(
    (state, props) => ({}),
    (dispatch, props) => ({
      onSubmit: createJob
    }),
)(QueueController);


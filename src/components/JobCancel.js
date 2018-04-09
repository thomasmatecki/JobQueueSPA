import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import {cancelJob} from './REST';


/**
 * Job Cancellation dialog.
 */
export class JobCancel extends Component {

  static propTypes = {
    jobId: PropTypes.number
  };

  state = {
    open: false
  };

  openDialog = () => {
    this.setState({open: true});
  };

  closeDialog = () => {
    this.setState({open: false});
  };


  render() {
    return (
        <Dialog
            open={this.state.open && this.props.jobId}
            title={`Are You Sure You Want to Cancel Job ${this.props.jobId}?`}
            modal={true}
            actions={[
              <FlatButton
                  label="Yes"
                  primary={true}
                  onClick={() => cancelJob(this.props.jobId).then(this.closeDialog)}/>,
              <FlatButton
                  label="No"
                  primary={true}
                  onClick={this.closeDialog}/>,]
            }/>
    );
  }
}
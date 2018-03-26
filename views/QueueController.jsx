

import React from 'react';
//import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';

export class QueueController extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      value: 'Property Value',
    };
  }

  static handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {

    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
          </ToolbarGroup>
        </Toolbar>

        <div>

          <div>
            <TextField
              id="text-field-controlled"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </div>
        </div>
      </div>);
  }
}
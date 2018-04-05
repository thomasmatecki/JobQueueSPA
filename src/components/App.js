import React, {Component} from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {QueueControllerContainer} from './QueueController.js';
import {JobQueueContainer} from './JobQueue.js';
import Toggle from 'material-ui/Toggle';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import CircularProgress from 'material-ui/CircularProgress';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import appReducer, {initialState} from '../state';
import {getAllJobs} from './REST';
import {TOGGLE_QUEUE} from '../constants';

/**
 *
 *
 */
const App = ({websocket}) => (
    <div>
      <AppBar
          title="Job Queue Application"
          showMenuIconButton={false}/>
      <div className="container">
        <Toolbar style={{margin: '3px'}}>
          <ToolbarGroup>
            <Toggle
                label="Pause"
                onToggle={(event, isInputChecked) => {
                  websocket.send(JSON.stringify({
                    type: TOGGLE_QUEUE,
                    status: isInputChecked
                  }));
                }}/>
            <ToolbarSeparator/>
          </ToolbarGroup>
        </Toolbar>
        <div className="split-container">
          <div className="split-child">
            <div className="controller-container">
              <QueueControllerContainer/>
            </div>
          </div>
          <div style={{width: '100%'}}>
            <div className="split-child">
              <JobQueueContainer/>
            </div>
          </div>
        </div>
      </div>
    </div>
);

/**
 * Instantiate a websocket connection and retrieve
 * initial state from the server. The websocket only
 * dispatches events to the store and thus is not
 * injected into the state for use throughout.
 */
class AppContainer extends Component {

  ws = new WebSocket('ws://localhost:3000/action');
  store;

  constructor(props) {
    super(props);
    this.state = {ready: false}
  }

  onWSOpen = (event) => {

    getAllJobs().then(json => {

      this.store = createStore(
          appReducer,
          initialState(json)
      );

      this.ws.onmessage = (event) => {
        this.store.dispatch(JSON.parse(event.data));
      };

      this.setState({ready: true});
    });
  };

  componentDidMount() {
    this.ws.onopen = this.onWSOpen;
  }

  render() {
    return (
        <MuiThemeProvider>
          <div>
            {this.state.ready ?
                <Provider store={this.store}>
                  <App websocket={this.ws}/>
                </Provider> :
                <CircularProgress
                    size={80}
                    thickness={5}/>}
          </div>
        </MuiThemeProvider>);
  }
}


render(
    <AppContainer/>,
    document.getElementById('app'));
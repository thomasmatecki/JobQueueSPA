/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative 
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

import React, {Component} from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {QueueController} from './QueueController.js';
import {JobQueueContainer} from './JobQueue.js';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import CircularProgress from 'material-ui/CircularProgress';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import appReducer, {initialState} from '../state';
import {getAllJobs} from './REST';
import PropTypes from 'prop-types';
import {LockToggleContainer} from "./LockToggle";

/**
 * Application scaffold.
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
            <LockToggleContainer
                websocket={websocket}/>
            <ToolbarSeparator/>
          </ToolbarGroup>
        </Toolbar>
        <div className="split-container">
          <div className="split-child">
            <div className="controller-container">
              <QueueController/>
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

App.propTypes = {
  websocket: PropTypes.object.isRequired
};


/**
 * Instantiates a websocket connection and retrieve
 * initial state from the server. The websocket only
 * dispatches events to the store and thus is not
 * injected into the state tree.
 *
 *
 */
class AppContainer extends Component {


  ws = new WebSocket(`ws://${window.location.host}/action`);
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

  /**
   * Display loading graphic until websocket connection
   * is established. Inject material-ui theming and
   * redux state into the application.
   * @returns {*}
   */
  render() {
    return (
        <MuiThemeProvider>
          <div>
            {this.state.ready ?
                <Provider store={this.store}>
                  <App websocket={this.ws}/>
                </Provider> :
                <div className="loader-container">
                  <CircularProgress
                      style={{top: '50%'}}
                      size={200}
                      thickness={5}/>
                </div>}
          </div>
        </MuiThemeProvider>);
  }
}


render(
    <AppContainer/>,
    document.getElementById('app'));
import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { QueueControllerContainer } from './QueueController.jsx';
import { JobQueueContainer } from './JobQueue.jsx';
import Toggle from 'material-ui/Toggle';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { appState } from '../model/jobs';

const styles = {

  toolbarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    paddingBottom: '1px'
  },

  controllerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    paddingLeft: '1px',
    paddingRight: '1px',
    paddingTop: '5px'
  },

  splitContainer: {
    display: 'flex',
    margin: '30px',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  splitChild: {
    padding: '5px',
  }
};


const store = createStore(appState);

class App extends React.Component {

  constructor(props) {
    super(props)

    const ws = new WebSocket('ws://localhost:3000/ws');

    ws.onmessage = function (event) {
      store.dispatch(JSON.parse(event.data));
    }

    ws.onopen = function (event) {

    }
  }

  render() {

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Job Queue Application"
            showMenuIconButton={false}
            iconClassNameRight="muidocs-icon-navigation-expand-more" />
          <div style={styles.splitContainer}>
            <div style={styles.splitChild}>
              <Toolbar>
                <ToolbarGroup>
                  <Toggle
                    label="Pause" />
                  <ToolbarSeparator />
                </ToolbarGroup>
              </Toolbar>
              <div style={styles.controllerContainer}>
                <QueueControllerContainer />
              </div>
            </div>
            <div style={styles.splitChild}>
              <JobQueueContainer />
            </div>
          </div>
        </div>
      </MuiThemeProvider>);
  }
}



render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'));
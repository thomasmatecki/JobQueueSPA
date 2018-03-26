'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { QueueController } from './QueueController';


const styles = {
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  splitChild: {
    flex: 1,
    margin: '5px'
  }
};


/**
 * 
 */
class App extends React.Component {

  render() {

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Title"
            showMenuIconButton={false}
            iconClassNameRight="muidocs-icon-navigation-expand-more" />
          <div className={styles.splitContainer}>
            <div className={styles.splitChild}>
              <QueueController />
            </div>
            <div className={styles.splitChild}>
            </div>
          </div>
        </div>
      </MuiThemeProvider>

    );
  }
}

export default App;
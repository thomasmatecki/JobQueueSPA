'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </head>
          <body >
            <div id="app"></div>
            <script src="js/bundle.js"></script>
          </body>
      </html>);
    }
  }
  
export default App;
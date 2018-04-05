'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="/css/styles.css"/>
        </head>
        <body>
        <div id="app"/>
        <script src="/js/bundle.js"/>
        </body>
        </html>);
  }
}

export default App;
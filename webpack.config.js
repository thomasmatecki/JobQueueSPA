/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

// Webpack config file
module.exports = {
    entry: './src/components/App.js',
    output: {
      path: __dirname + '/assets/js',
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader'
        }
      ]
    },
  };
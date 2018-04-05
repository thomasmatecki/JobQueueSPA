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
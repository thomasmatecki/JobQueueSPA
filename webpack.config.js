// Webpack config file
module.exports = {
    entry: './components/App.jsx',
    output: {
      path: __dirname + '/assets/js',
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          loader: 'babel-loader'
        }
      ]
    },
  };
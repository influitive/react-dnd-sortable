var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname,

  devtool: 'eval',

  entry: [
    'webpack-hot-middleware/client',
    './app'
  ],

  output: {
    path:       __dirname + '/build',
    filename:   'bundle.js',
    publicPath: '/static/'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      {
        test:    /\.jsx?$/,
        include: [/src/, /example/],
        loaders: ['babel']
      }
    ]
  }
};

var webpack = require('webpack');

var defaultEnv = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': '"development"'
  }
});

module.exports = {

  context: __dirname + '/src',

  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8080/javascripts/',
      'webpack/hot/only-dev-server',
      './app.jsx'
    ]
  },

  output: {
    filename: '[name].js', // Will output app.js (for example with above entry)
    path: __dirname + '/public', // I don't think this matters since files aren't actually outputted??
    publicPath: 'http://localhost:8080/javascripts/' // Required for webpack-dev-server
  },

  // Require the webpack and react-hot-loader plugins
  plugins: [
    defaultEnv,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  resolve: {
    root: __dirname,
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      { test: /\.jsx$/, loaders: ['react-hot', 'jsx-loader'] },
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'strict' }
    ]
  }
};

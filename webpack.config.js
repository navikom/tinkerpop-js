require('extract-text-webpack-plugin');

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'sourcemap',
  entry: [
    'babel-polyfill',
    'webpack/hot/dev-server',
    './index.js',
  ],
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      {
        test: [/\.js?$/],
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.html$/,
        loader: 'raw',
      },
    ],
  },
  node: {
    fs: "empty",
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './views/index.ejs',
      inject: false,
    }),
  ],
};

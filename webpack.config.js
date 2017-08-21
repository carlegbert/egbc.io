const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, 'src', 'index.html'),
  filename: 'index.html',
  inject: 'head',
  favicon: 'img/favicon-32x32.png',
});

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }, {
        test: /\.png$/,
        loader: 'file-loader',
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'build'),
  },
  plugins: [
    HTMLWebpackPluginConfig,
  ],
};

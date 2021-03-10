const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', 'app.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
		{ loader: 'babel-loader', options: { presets: ["@babel/preset-env", "@babel/preset-react"]}},
		{ loader: 'eslint-loader'}
		]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html') })]
};
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src', 'app.jsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'babel-loader', options: { presets: ['@babel/preset-env', '@babel/preset-react'] } },
                    { loader: 'eslint-loader' },
                ],
            },
            {
                // Preprocess your css files
                // you can add additional loaders here (e.g. sass/less etc.)
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(gif|svg|jpg|png)$/,
                loader: 'file-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html') }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.config().parsed),
        })],
};

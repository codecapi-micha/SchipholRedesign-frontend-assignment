const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
    output: {
        path: __dirname + '/dist',
        filename: 'index.bundle.js',
        clean: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Custom templaaaate',
            // Load a custom template (lodash by default)
            template: './src/index.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(s(a|c)ss)$/,
                use: ['style-loader','css-loader', 'sass-loader'],
            }],
    },
    devServer: {
        static: [
            {
                directory: path.join(__dirname, 'src', 'server'),
                publicPath: '/api',
            },
        ],
        hot: true,
    },
    mode: 'development',
    resolve:{
        extensions: ['.js', '.scss'],
    },
}
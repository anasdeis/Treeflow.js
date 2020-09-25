var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var path = require('path');
module.exports = {
    context: path.join(__dirname, '/'),
    devtool: debug ? 'inline-sourcemap' : null,
    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        './Main.js',
    ],
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: { presets: ['@babel/env','@babel/preset-react'], plugins: [['@babel/plugin-proposal-decorators', { 'legacy': true }], '@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-function-bind'] }
                    }
                ],
            },
            {
                test: /.css$/,
                use: [
                  {
                    loader: 'style-loader'
                  },
                  {
                    loader: 'css-loader'
                  }
                ]
            },
            {
                test: /.less$/,
                use: [ {loader: 'style-loader'}, {loader: 'css-loader'}, {loader: 'less-loader'} ]
            },
            {
                test: /.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader?limit=4000&name=[name]-[hash:5].[ext]'
                    },
                    {
                        loader: 'image-webpack-loader'
                    }
                ]
            }
        ]
    },
    devServer:{
        historyApiFallback: true
    },
    resolve:{
        modules:[path.resolve(__dirname, 'lib'),path.resolve(__dirname,'node_modules')],
        extensions:['.js']
    },
    output: {
        path: path.join(__dirname, '/'),
        filename: 'main.min.js',
        publicPath:'/'
    },
    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ]
};
const fsPath = require('fs-path');

const webpackSettings="var debug = process.env.NODE_ENV !== 'production';\n\
var webpack = require('webpack');\n\
var path = require('path');\n\
module.exports = {\n\
    context: path.join(__dirname, '/'),\n\
    devtool: debug ? 'inline-sourcemap' : null,\n\
    entry: [\n\
        'webpack/hot/dev-server',\n\
        'webpack-hot-middleware/client',\n\
        './Main.js',\n\
    ],\n\
    module: {\n\
        rules: [\n\
            {\n\
                test: /\.js$/,\n\
                exclude: /(node_modules|bower_components)/,\n\
                use: [\n\
                    {\n\
                        loader: 'babel-loader',\n\
                        query: { presets: ['@babel/env','@babel/preset-react'], plugins: [['@babel/plugin-proposal-decorators', { 'legacy': true }], '@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-function-bind'] }\n\
                    }\n\
                ],\n\
            },\n\
            {\n\
                test: /\.css$/,\n\
                use: [\n\
                    {\n\
                        loader: 'css-loader'\n\
                    }\n\
                ]\n\
            },\n\
            {\n\
                test: /.less$/,\n\
                use: [ {loader: 'style-loader'}, {loader: 'css-loader'}, {loader: 'less-loader'} ]\n\
            },\n\
            {\n\
                test: /\.(png|jpg|gif|svg)$/i,\n\
                use: [\n\
                    {\n\
                        loader: 'url-loader?limit=4000&name=[name]-[hash:5].[ext]'\n\
                    },\n\
                    {\n\
                        loader: 'image-webpack-loader'\n\
                    }\n\
                ]\n\
            }\n\
        ]\n\
    },\n\
    devServer:{\n\
        historyApiFallback: true\n\
    },\n\
    resolve:{\n\
        modules:[path.resolve(__dirname, 'lib'),path.resolve(__dirname,'node_modules')],\n\
        extensions:['.js']\n\
    },\n\
    output: {\n\
        path: path.join(__dirname, '/'),\n\
        filename: 'main.min.js',\n\
        publicPath:'/'\n\
    },\n\
    plugins: debug ? [] : [\n\
        new webpack.optimize.DedupePlugin(),\n\
        new webpack.optimize.OccurenceOrderPlugin(),\n\
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),\n\
    ]\n\
};"

module.exports = (path) => {
    fsPath.writeFile(path+'/webpack.config.js', webpackSettings, function(err){
        if (err) throw err;
    });
}

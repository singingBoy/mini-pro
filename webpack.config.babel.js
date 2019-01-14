import fs from 'fs';
import {join, parse, resolve} from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

import {OUTPUT} from './config/config.util';

const entries = allSrcFiles(__dirname);
console.log(entries);

const constructFileLoader = (ext) => {
    console.log('=====>', `[name].${ext || '[ext]'}`);
    return {
        loader: 'file-loader',
        options: {
            outputPath: (url, resourcePath, context) => {
                return resourcePath.replace(context, '').replace('src', '');
            },
            name: `[name].${ext || '[ext]'}`,
        },
    }
};

export default {
    entry: entries,
    output: {
        path: resolve(OUTPUT),
        publicPath: '/',
        filename: 'app.js',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                common: {
                    name: "common",
                    chunks: "all",
                    minChunks: 2,
                    minSize: 1,
                    priority: 0
                },
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin([OUTPUT]),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }, {
            test: /\.json$/i,
            type: 'javascript/auto',
            use: [
                constructFileLoader('json'),
            ],
        }, {
            test: /\.wxml$/,
            use: [
                constructFileLoader('wxml'),
            ],
        }, {
            test: /\.less|.css$/,
            exclude: resolve('node_modules'),
            use: [
                constructFileLoader('wxss'),
                ],
        }]
    },
    devServer: {
        contentBase: './dist',
        hot: true,
    },
    watchOptions: {
        ignored: ['node_modules', 'dist'],
        aggregateTimeout: 300,
    },
    mode: process.env.NODE_ENV,
}

function allSrcFiles(context) {
    const srcPath = resolve(`${context}/src`);
    const filesPath = [];

    function traverseFiles(path) {
        let files = fs.readdirSync(path);
        files.forEach(item => {
            let fPath = join(path, item);
            let stat = fs.statSync(fPath);
            if (stat.isDirectory() === true) {
                traverseFiles(fPath);
            }
            if (stat.isFile() === true) {
                filesPath.push(fPath);
            }
        });
    }

    traverseFiles(srcPath);
    return filesPath;
}
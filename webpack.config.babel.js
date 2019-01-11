import fs from 'fs';
import {resolve, parse, join} from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import MultiEntryPlugin from "webpack/lib/MultiEntryPlugin";

import BuildUtils, {OUTPUT} from './config/config.util';

const entries = allSrcFiles(__dirname);
console.log(entries);

const constructFileLoader = (ext) => {
  console.log('=====>', `[name].${ext || '[ext]'}`);
  return {
    loader: 'file-loader',
    options: {
      outputPath: (url, resourcePath, context) => {
        return resourcePath.replace(context, '').replace('src2', '');
      },
      name: `[name].${ext || '[ext]'}`,
    },
  }
};

export default {
  entry: {
    app: [
      './src2/app.js',
    ],
  },
  output: {
    path: resolve(OUTPUT),
    publicPath: '/',
    filename: '[name].js',
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
    new MultiEntryPlugin(__dirname, entries, ''),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.json$/,
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
        {
          loader: 'less-loader',
          options: {
            sourceMap: process.env.NODE_ENV === 'development',
            paths: [
              resolve(__dirname, 'node_modules')
            ]
          }
        }],
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
  const srcPath = resolve(`${context}/src2`);
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
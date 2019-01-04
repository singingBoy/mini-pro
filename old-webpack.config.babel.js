import {resolve} from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import BuildUtils, {OUTPUT} from './config/config.util';

const config = new BuildUtils();
export default {
  entry: config.entry,
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
    // new CopyWebpackPlugin([{
    //   from: 'src/**/*.json',
    //   to: '',
    // }]),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.less|.css$/,
      include: resolve('src'),
      exclude: resolve('node_modules'),
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].wxss',
        },
      }, {
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
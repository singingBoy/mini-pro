import {resolve} from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import {entry} from './config/config.util';
console.log(entry());

export default {
  entry: entry(),
  output: {
    path: resolve('dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [{
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
  }
}
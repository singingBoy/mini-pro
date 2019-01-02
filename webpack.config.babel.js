import {resolve} from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export default {
  entry: {
    app: ['./src/app.js'],
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  watchOptions: {
    ignored: ['node_modules', 'dist'],
    aggregateTimeout: 300,
  }
}
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: slsw.lib.webpack.isLocal ? 'eval-source-map' : 'source-map',
  entry: slsw.lib.entries,
  resolve: {
    symlinks: false,
    cacheWithContext: false,
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  externals: [nodeExternals()],
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /(.tsx|.ts)?$/,
        exclude: [[path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, '.serverless'), path.resolve(__dirname, '.webpack')]],
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.build.json',
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.WEBPACK_RUNNER': JSON.stringify(true),
    }),
    new CleanWebpackPlugin(),
  ],
  stats: 'errors-only',
};

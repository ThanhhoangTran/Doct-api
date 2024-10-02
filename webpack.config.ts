/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import * as path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import * as webpack from 'webpack';
import * as slsw from 'serverless-offline';

const nodeExternals = require('webpack-node-externals');

const config: webpack.Configuration = {
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: slsw.lib.webpack.isLocal ? 'eval-source-map' : 'source-map',
  entry: slsw.lib.entries,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
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
    nodeEnv: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /(.tsx|.ts)?$/,
        exclude: [[path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, '.serverless'), path.resolve(__dirname, 'webpack')]],
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
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, './src/i18n'), to: './src/i18n' }],
    }),
    new webpack.DefinePlugin({
      'process.env.WEBPACK_RUNNER': JSON.stringify(true),
    }),
    new CleanWebpackPlugin(),
  ],
  stats: 'errors-only',
};

export default config;

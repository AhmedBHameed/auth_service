const path = require('path');
const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');
const ESLintPlugin = require('eslint-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const APP_DIR = path.resolve(__dirname, './src');
const BUILD_DIR = path.resolve(__dirname, './build');

function buildConfig(_, argv) {
  const isProd = argv.mode === 'production';
  const BUILD_ENV = isProd ? 'production' : 'development';

  return {
    entry: {
      app: `${APP_DIR}/app.ts`,
      seeds: `${APP_DIR}/seeds.ts`,
    },
    output: {
      path: BUILD_DIR,
      filename: `[name].${BUILD_ENV}.js`,
    },
    devtool: isProd ? undefined : 'eval-source-map',
    mode: isProd ? 'production' : 'development',
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        src: APP_DIR,
      },
    },
    plugins: [
      new Dotenv({safe: true, allowEmptyValues: true}),
      new ESLintPlugin(),
      new CleanWebpackPlugin(),
      new NodemonPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ['ts-loader'],
          exclude: /node_modules/,
        },
      ],
    },
  };
}

module.exports = buildConfig;

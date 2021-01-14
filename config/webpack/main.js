const path = require('path');
const dotenv = require('dotenv');
const {DefinePlugin} = require('webpack');
// const CopyPlugin = require("copy-webpack-plugin");
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const APP_DIR = path.resolve(__dirname, '../../src');
const BUILD_DIR = path.resolve(__dirname, '../../dist');
const ROOT_DIR = path.resolve(__dirname, '../../');
const {
  GITHUB_ACTIONS,
  NODE_ENV,
  PORT,
  SECRET,
  LOG_LEVEL,
  MONGODB_USER,
  MONGODB_PASS,
  MONGODB_SERVER,
  MONGODB_SERVER_NO_CONTAINER,
  MONGODB_PORT,
  MONGODB_DB,
  VERSION
} = process.env;

const config = () => {
  const environments = GITHUB_ACTIONS
    ? {
        NODE_ENV,
        PORT,
        SECRET,
        LOG_LEVEL,
        MONGODB_USER,
        MONGODB_PASS,
        MONGODB_SERVER,
        MONGODB_SERVER_NO_CONTAINER,
        MONGODB_PORT,
        MONGODB_DB,
        VERSION
      }
    : dotenv.config({path: `${ROOT_DIR}/.${NODE_ENV}.env`}).parsed;

  return {
    entry: {
      app: `${APP_DIR}/app.ts`,
      seeds: `${APP_DIR}/seeds.ts`,
    },
    output: {
      path: BUILD_DIR,
      filename: `[name].${NODE_ENV}.js`,
    },
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        src: path.resolve(__dirname, '..', '..', 'src'),
      },
    },
    plugins: [
      new ESLintPlugin(),
      new DefinePlugin({
        'process.env': JSON.stringify(environments),
      }),
      new CleanWebpackPlugin(),
      new NodemonPlugin(),
    ],
    module: {
      rules: [
        /**
         * ESLINT
         * First, run the linter.
         * It's important to do this before Babel processes the JS.
         * Only testing .ts and .tsx files (React code)
         */
        // {
        //   test: /\.ts$/,
        //   enforce: 'pre',
        //   use: [
        //     {
        //       options: {
        //         eslintPath: require.resolve('eslint'),
        //       },
        //       loader: require.resolve('eslint-loader'),
        //     },
        //   ],
        //   exclude: /node_modules/,
        // },
        {
          test: /\.ts$/,
          use: ['ts-loader'],
          exclude: /node_modules/,
        },
      ],
    },
  };
};

module.exports = config;

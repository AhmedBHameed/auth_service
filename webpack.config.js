const path = require('path');
const {DefinePlugin} = require('webpack');
const nodeExternals = require('webpack-node-externals');
const ESLintPlugin = require('eslint-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const APP_DIR = path.resolve(__dirname, './src');
const BUILD_DIR = path.resolve(__dirname, './dist');

const {BUILD_ENV, VERSION, MONGODB_PASS, SECRET} = process.env;
const isProd = BUILD_ENV === 'production';
function buildConfig() {
  const {BUILD_ENV} = process.env;
  if (BUILD_ENV !== 'development' && BUILD_ENV !== 'production')
    throw new Error("Wrong webpack build parameter. Possible choices: 'development' or 'production'.");

  return {
    entry: {
      app: `${APP_DIR}/app.ts`,
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
      new ESLintPlugin(),
      new DefinePlugin({
        'process.env': JSON.stringify({
          BUILD_ENV,
          VERSION,
          MONGODB_PASS,
          SECRET,
        }),
      }),
      new CleanWebpackPlugin(),
      new NodemonPlugin(),
    ],
    module: {
      rules: [
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
}

module.exports = buildConfig;

const mainWebpackConfig = require('./main');

const devConfig = () => {
  const mainConfig = mainWebpackConfig();
  return {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    ...mainConfig,
    devtool: 'eval-source-map',
    mode: 'development',
  };
};

module.exports = devConfig;

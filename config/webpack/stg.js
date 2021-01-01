const mainWebpackConfig = require('./main');

const stgConfig = env => {
  const mainConfig = mainWebpackConfig(env);
  return {
    ...mainConfig,
    devtool: 'eval-source-map',
    output: {
      ...mainConfig.output,
      filename: `[app].${env}.js`,
    },
    mode: 'development',
  };
};

module.exports = stgConfig;

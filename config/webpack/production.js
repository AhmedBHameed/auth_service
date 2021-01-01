const mainWebpackConfig = require('./main');

const prodConfig = env => {
  const mainConfig = mainWebpackConfig(env);
  return {
    ...mainConfig,
    output: {
      ...mainConfig.output,
      filename: `[name].${env}.js`,
    },
    mode: 'production',
  };
};

module.exports = prodConfig;

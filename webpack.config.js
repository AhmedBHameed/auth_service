function buildConfig() {
  const {NODE_ENV} = process.env;
  if (NODE_ENV !== 'development' && NODE_ENV !== 'production')
    throw new Error("Wrong webpack build parameter. Possible choices: 'development' or 'production'.");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require('./config/webpack/' + NODE_ENV + '.js');
  return config();
}

module.exports = buildConfig;

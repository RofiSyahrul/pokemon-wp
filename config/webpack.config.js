const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

/**
 * @param {{ env: string }} args
 * @returns {import('webpack').Configuration}
 */
function configFactory(args) {
  if (typeof args !== 'object') return {};
  const { env } = args;
  const envConfig = require(`./webpack.${env}.js`);
  return merge(commonConfig, envConfig);
}

module.exports = configFactory;

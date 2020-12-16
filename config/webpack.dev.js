const { HotModuleReplacementPlugin } = require('webpack');

/** @type {import('webpack').Configuration} */
const devConfig = {
  mode: 'development',
  devtool: 'nosources-source-map',
  plugins: [new HotModuleReplacementPlugin()],
  devServer: {
    contentBase: './public',
    hot: true,
    historyApiFallback: true,
    port: 1234,
  },
};

module.exports = devConfig;

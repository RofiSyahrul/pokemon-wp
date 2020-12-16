const WebpackCompression = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const isLocalBuild = /local/i.test(process.env.BUILD_ENV || '');

const compression = new WebpackCompression({
  deleteOriginalAssets: true,
  filename: info => info.file,
  algorithm: 'gzip',
  test: /\.js(\.gz)?(\?.*)?$/,
  minRatio: 1,
  exclude: /(service-worker|sw)\.js$/,
});

const copy = new CopyPlugin({
  patterns: [{ from: './public' }],
});

const serviceWorker = new GenerateSW({
  swDest: 'sw.js',
  clientsClaim: true,
  skipWaiting: true,
});

/** @returns {import('webpack').WebpackPluginInstance[]} */
function getPlugins() {
  const plugins = [copy, serviceWorker];
  if (!isLocalBuild) {
    plugins.push(compression);
  }
  return plugins;
}

/** @type {import('webpack').Configuration} */
const prodConfig = {
  mode: 'production',
  plugins: getPlugins(),
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
  },
};

module.exports = prodConfig;

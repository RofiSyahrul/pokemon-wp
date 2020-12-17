const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { config } = require('dotenv');
const { alias, entry, env, root, src, dist } = require('../.paths');

config({ path: env });

/** @type {import('webpack').Configuration} */
const commonConfig = {
  entry,
  context: root,
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(bmp|gif|jpe?g|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[ext]/[name].[ext]',
          esModule: false,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
          esModule: false,
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [src, 'node_modules'],
    alias,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({ extensions: ['js', 'jsx'] }),
    new HtmlWebpackPlugin({
      title: 'Pokemon Explorer by Rofi',
      template: './public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'initial',
    }),
    new DefinePlugin({
      __DEV__: process.env.NODE_ENV !== 'production',
      BASE_URL: JSON.stringify(process.env.BASE_URL),
      BASE_IMAGE_URL: JSON.stringify(process.env.BASE_IMAGE_URL),
      PAGINATION_LIMIT: Number(process.env.PAGINATION_LIMIT),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  output: {
    path: dist,
    publicPath: '/',
    filename: 'js/_app.js',
    chunkFilename: 'js/[name]-[contenthash].js',
  },
  stats: {
    errors: true,
    errorStack: true,
    errorsCount: true,
    warnings: true,
    warningsCount: true,
    assets: true,
    reasons: true,
  },
};

module.exports = commonConfig;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');
const path = require('path');
const is_prod = process.env.NODE_ENV === 'production';

const plugins = [
  new HtmlWebpackPlugin({
    title: 'Webpack Basics Example',
    inject: 'body',
    template: './src/public/index.html'
  }),
  new MiniCssExtractPlugin()
];

const prodPlugins = [
  new WebpackPwaManifest({
    name: 'Indexed DB Example - PWA',
    short_name: 'idb_pwa',
    description: 'Example PWA app using IDB',
    background_color: '#ffffff',
    theme_color: '#fff',
    start_url: '.',
    publicPath: '/',
    inject: true,
    // crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
    icons: [
      {
        src: path.resolve('src/images/icon.png'),
        sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
      }
    ]
  }),
  new WorkboxPlugin.GenerateSW()
];

if (process.env.NODE_ENV === 'production') plugins.push(...prodPlugins);

module.exports = {
  mode: is_prod ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: 'bundle.js'
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env']
            ]
          }
        }
      }
    ],
  },
  devServer: {
    compress: true,
    watchFiles: ['./src/public/index.html']
  }
}
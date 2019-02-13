const path = require('path');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
const IS_DEV_MODE = process.env.NODE_ENV === 'development';

const BUILD_PATH = path.resolve(__dirname, 'build', 'public');

module.exports = {
  mode: IS_DEV_MODE ? 'development' : 'production',
  devtool: IS_DEV_MODE ? 'inline-source-map' : undefined,

  entry: path.resolve(__dirname, 'src', 'index.tsx'),

  output: {
    filename: 'lebkuchen-fm-app.js',
    path: BUILD_PATH,
  },

  devServer: IS_DEV_MODE
    ? { contentBase: BUILD_PATH, stats: 'errors-only', compress: true, port: 9000 }
    : undefined,

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { composePlugins, withNx } = require('@nx/webpack');
const { merge } = require('webpack-merge');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = 'style-loader';

module.exports = (config, { options, context }) => {
  const customConfig = {
    mode: isProduction ? 'production' : 'development',
    entry: './index.ts',
    output: {
      path: path.resolve(__dirname, 'dist/'),
    },
    devtool: 'source-map',
    devServer: {
      open: false,
      host: 'localhost',
      port: 3000,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
      }),

      // Add your plugins here
      // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          loader: 'ts-loader',
          exclude: ['/node_modules/'],
        },
        {
          test: /\.css$/i,
          use: [stylesHandler, 'css-loader'],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: 'asset',
        },

        // Add your rules for custom modules here
        // Learn more about loaders from https://webpack.js.org/loaders/
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
  };

  return merge(customConfig);
};

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getWebpackConfig;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

var _friendlyErrorsWebpackPlugin2 = _interopRequireDefault(_friendlyErrorsWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getWebpackConfig(opt) {

    return {
        babel: {
            cacheDirectory: true,
            presets: [require.resolve('babel-preset-es2015-ie'), require.resolve('babel-preset-react'), require.resolve('babel-preset-stage-0')],
            plugins: [require.resolve('babel-plugin-add-module-exports'), require.resolve('babel-plugin-transform-decorators-legacy')]
        },

        output: {
            path: (0, _path.join)(process.cwd(), 'dist'),
            filename: ''
        },

        devtool: 'source-map',

        entry: {},

        module: {
            rules: [{
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    minetype: 'application/font-woff'
                }
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    minetype: 'application/font-woff'
                }
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    minetype: 'application/octet-stream'
                }
            }, { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    minetype: 'application/vnd.ms-fontobject'
                }
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    minetype: 'image/svg+xml'
                }
            }, {
                test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }, {
                test: /\.html?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }]
        },

        plugins: [new _webpack2.default.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: commonName
        }), new _extractTextWebpackPlugin2.default()]
    };
}
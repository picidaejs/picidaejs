import webpack from 'webpack'
import {join} from 'path'

import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin'

export default function getWebpackConfig (opt) {

    return {
        babel: {
            cacheDirectory: true,
            presets: [
                require.resolve('babel-preset-es2015-ie'),
                require.resolve('babel-preset-react'),
                require.resolve('babel-preset-stage-0')
            ],
            plugins: [
                require.resolve('babel-plugin-add-module-exports'),
                require.resolve('babel-plugin-transform-decorators-legacy'),
            ],
        },

        output: {
            path: join(process.cwd(), 'dist'),
            filename: '[name]',
        },

        devtool: 'source-map',

        entry: {

        },

        module: {
            rules: [
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        minetype: 'application/font-woff',
                    },
                },
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        minetype: 'application/font-woff',
                    },
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        minetype: 'application/octet-stream',
                    },
                },
                { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        minetype: 'application/vnd.ms-fontobject',
                    },
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        minetype: 'image/svg+xml',
                    },
                },
                {
                    test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                    },
                },
                {
                    test: /\.html?$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    },
                }
            ]
        },

        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                filename: commonName,
            }),
            new ExtractTextWebpackPlugin()
        ]
    }
}
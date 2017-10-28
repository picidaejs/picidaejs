import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { existsSync } from 'fs';
import { join } from 'path';
import autoprefixer from 'autoprefixer';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import notifier from 'node-notifier';

import getBabelCommonConfig from './getBabelCommonConfig';
/* eslint quotes:0 */

export default function getWebpackCommonConfig(args = {}) {
    const pkgPath = join(args.cwd || '.', 'package.json');
    const pkg = existsSync(pkgPath) ? require(pkgPath) : {};

    const jsFileName = args.hash ? '[name]-[chunkhash].js' : '[name].js';
    const cssFileName = args.hash ? '[name]-[chunkhash].css' : '[name].css';
    const commonName = args.hash ? 'common-[chunkhash].js' : 'common.js';
    const chunkFilename = args.hash ? '[name]-[chunkhash].js' : '[name].js';
    //         chunkFilename: 'modules/[name].min.js?v=[chunkhash]'


    const silent = args.silent === true;
    const dev = 'dev' in args ? args.dev : true
    const babelOptions = getBabelCommonConfig();

    const postcssOptions = {
        sourceMap: true,
        plugins: [
            // require('postcss-focus'),
            autoprefixer({
                browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
            }),
        ],
    };

    const emptyBuildins = [
        'child_process',
        'cluster',
        'dgram',
        'dns',
        'fs',
        'module',
        'net',
        'readline',
        'repl',
        'tls',
    ];

    const browser = pkg.browser || {};

    const node = emptyBuildins.reduce((obj, name) => {
        if (!(name in browser)) {
            return { ...obj, ...{ [name]: 'empty' } };
        }
        return obj;
    }, {});

    const config = {
        babel: babelOptions,
        cache: true,
        postcss: postcssOptions,
        output: {
            path: join(process.cwd(), './dist/'),
            filename: jsFileName,
            chunkFilename: chunkFilename,
        },

        devtool: dev && 'source-map',

        // context: join(__dirname, '/../../../node_modules'),

        resolve: {
            modules: ['node_modules', join(__dirname, '/../../../node_modules')],
            // root: ['node_modules', join(__dirname, '/../../../node_modules')],
        },

        entry: pkg.entry,

        node,

        module: {
            // noParse: [/moment.js/],
            loaders: [
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract(['css-loader', 'postcss', 'less'])
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract(['css-loader', 'postcss'])
                },
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: [
                        function (name) {
                            return !/\/picidae-(plugin|transformer|theme|commander)/.test(name)
                                && !/(node_modules|bower_components)\/picidae/.test(name)
                                && /(node_modules|bower_components)/.test(name)
                        },
                        /\/node_modules\/core-js\//
                    ],
                    options: babelOptions,
                },
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
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
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
                    },
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader',
                    options: {
                        name: '[path][name].[ext]',
                    },
                },
            ],
        },

        plugins: [
            new webpack.ProgressPlugin(function(percentage, msg) {
                const stream = process.stdout;
                if (stream.isTTY && percentage < 0.71) {
                    stream.cursorTo(0);
                    stream.write('  ' + require('chalk').cyan(msg));
                    stream.clearLine(1);
                } else if (percentage === 1) {
                    console.log('');
                    console.log(require('chalk').cyan('webpack: bundle build is now finished.'));
                }
            }),
            // new webpack.optimize.CommonsChunkPlugin('common', commonName),
            new ExtractTextPlugin('style.css', {
                // filename: cssFileName,
                disable: false,
                allChunks: true,
            }),
            dev && new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': dev ? '"development"' : '"production"',
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            !dev && new webpack.optimize.UglifyJsPlugin({
                output: {comments: false},
                compress: {
                    warnings: false
                }
            }),
            new CaseSensitivePathsPlugin(),
            dev && new FriendlyErrorsWebpackPlugin({
                onErrors: (severity, errors) => {
                    if (silent) return;
                    if (severity !== 'error') {
                        notifier.notify({
                            title: 'picidae',
                            message: 'warn',
                            // contentImage: join(__dirname, '../assets/warn.png'),
                            sound: 'Glass',
                        });
                        return;
                    }
                    const error = errors[0];
                    notifier.notify({
                        title: 'picidae',
                        message: `${severity} : ${error.name}`,
                        subtitle: error.file || '',
                        // contentImage: join(__dirname, '../assets/fail.png'),
                        sound: 'Glass',
                    });
                },
            }),
        ].filter(Boolean),
    };

    return config;
}

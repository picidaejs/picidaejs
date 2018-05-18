'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

exports.default = getWebpackCommonConfig;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _fs = require('fs');

var _path = require('path');

var _findParentDir = require('../utils/find-parent-dir');

var _findParentDir2 = _interopRequireDefault(_findParentDir);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

var _friendlyErrorsWebpackPlugin2 = _interopRequireDefault(_friendlyErrorsWebpackPlugin);

var _nodeNotifier = require('node-notifier');

var _nodeNotifier2 = _interopRequireDefault(_nodeNotifier);

var _getBabelCommonConfig = require('./getBabelCommonConfig');

var _getBabelCommonConfig2 = _interopRequireDefault(_getBabelCommonConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var over = require('../utils/overwrite-require');

var _over$getInfo = over.getInfo(),
    type = _over$getInfo.type;
/* eslint quotes:0 */

function getWebpackCommonConfig() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var pkgPath = (0, _path.join)(args.cwd || '.', 'package.json');
    var pkg = (0, _fs.existsSync)(pkgPath) ? require(pkgPath) : {};

    var publicPath = args.publicPath || '';
    var jsFileName = args.hash ? '[name]-[chunkhash].js' : '[name].js';
    var cssFileName = args.hash ? '[name]-[chunkhash].css' : '[name].css';
    var commonName = args.hash ? 'PICIDAE_COMMON-[chunkhash].js' : 'PICIDAE_COMMON.js';
    var chunkFilename = args.hash ? '[name]-[chunkhash].js' : '[name].js';
    //         chunkFilename: 'modules/[name].min.js?v=[chunkhash]'


    var silent = args.silent === true;
    var dev = 'dev' in args ? args.dev : true;
    var babelOptions = (0, _getBabelCommonConfig2.default)();

    var postcssOptions = {
        sourceMap: true,
        plugins: [
        // require('postcss-focus'),
        (0, _autoprefixer2.default)({
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
        })]
    };

    var emptyBuildins = ['child_process', 'cluster', 'dgram', 'dns', 'fs', 'module', 'net', 'readline', 'repl', 'tls'];

    var browser = pkg.browser || {};

    var node = emptyBuildins.reduce(function (obj, name) {
        if (!(name in browser)) {
            return (0, _extends4.default)({}, obj, (0, _defineProperty3.default)({}, name, 'empty'));
        }
        return obj;
    }, {});

    var cwdRoot = (0, _findParentDir2.default)('node_modules', process.cwd(), false) || '';

    var context = void 0;
    var root = void 0;
    var alias = void 0;
    if (type === 'global') {
        context = (0, _path.join)(__dirname, '../../..');
        root = [(0, _path.join)(cwdRoot, 'node_modules'), (0, _path.join)(context, 'node_modules')];
        alias = {
            'picidae': context
        };
    }

    var config = {
        babel: babelOptions,
        cache: true,
        postcss: postcssOptions,
        output: {
            path: (0, _path.join)(process.cwd(), './dist/'),
            filename: jsFileName,
            chunkFilename: chunkFilename,
            publicPath: publicPath
        },
        devtool: dev && 'source-map',
        context: context,
        resolveLoader: {
            root: root
        },
        resolve: {
            alias: alias,
            root: root
        },
        entry: pkg.entry,

        node: node,

        module: {
            // noParse: [/moment.js/],
            loaders: [{
                test: /\.less$/,
                loader: dev ? 'style-loader!css-loader?sourceMap!postcss-loader?sourceMap!less-loader?sourceMap' : _extractTextWebpackPlugin2.default.extract(['css-loader', 'postcss-loader', 'less-loader'])
            }, {
                test: /\.css$/,
                loader: dev ? 'style-loader!css-loader?sourceMap' : _extractTextWebpackPlugin2.default.extract(['css-loader', 'postcss-loader'])
            }, {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: [function (name) {
                    return !/[\/\\]picidae-(plugin|transformer|theme|commander)/.test(name) && !/([\/\\])(node_modules|bower_components)\1picidae/.test(name) && /([\/\\])(node_modules|bower_components)\1/.test(name);
                }, /([\/\\])node_modules\1(core-js|babel-runtime)\1/],
                options: babelOptions,
                query: babelOptions
            }, {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    minetype: 'application/font-woff'
                }
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    minetype: 'application/font-woff'
                }
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    minetype: 'application/octet-stream'
                }
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    minetype: 'application/vnd.ms-fontobject'
                }
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    minetype: 'image/svg+xml'
                }
            }, {
                test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
                loader: 'file-loader',
                query: {
                    name: '[path][name].[ext]'
                }
            }, {
                test: /\.html?$/,
                loader: 'file-loader',
                query: {
                    name: '[path][name].[ext]'
                }
            }, {
                test: /\.json$/,
                loader: 'json-loader',
                query: {
                    name: '[path][name].[ext]'
                }
            }]
        },

        plugins: [new _webpack2.default.ProgressPlugin(function (percentage, msg) {
            var stream = process.stdout;
            if (stream.isTTY && percentage < 0.71) {
                stream.cursorTo(0);
                stream.write('  ' + require('chalk').cyan(msg));
                stream.clearLine(1);
            } else if (percentage === 1) {
                console.log('');
                console.log(require('chalk').cyan('webpack: bundle build is now finished.'));
            }
        }), new _webpack2.default.optimize.CommonsChunkPlugin('common', commonName), new _extractTextWebpackPlugin2.default('style.css', {
            // filename: cssFileName,
            disable: false,
            allChunks: true
        }), dev && new _webpack2.default.HotModuleReplacementPlugin(), new _webpack2.default.DefinePlugin({
            'process.env.NODE_ENV': dev ? '"development"' : '"production"'
        }), new _webpack2.default.optimize.OccurrenceOrderPlugin(), !dev && new _webpack2.default.optimize.UglifyJsPlugin({
            output: { comments: false },
            compress: {
                warnings: false
            }
        }), new _caseSensitivePathsWebpackPlugin2.default(), dev && new _friendlyErrorsWebpackPlugin2.default({
            onErrors: function onErrors(severity, errors) {
                if (silent) return;
                if (severity !== 'error') {
                    _nodeNotifier2.default.notify({
                        title: 'picidae',
                        message: 'warn',
                        // contentImage: join(__dirname, '../assets/warn.png'),
                        sound: 'Glass'
                    });
                    return;
                }
                var error = errors[0];
                _nodeNotifier2.default.notify({
                    title: 'picidae',
                    message: severity + ' : ' + error.name,
                    subtitle: error.file || '',
                    // contentImage: join(__dirname, '../assets/fail.png'),
                    sound: 'Glass'
                });
            }
        })].filter(Boolean)
    };

    return config;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = maker;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _console = require('../utils/console');

var _console2 = _interopRequireDefault(_console);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function maker(_ref) {
    var webpackConfig = _ref.webpackConfig,
        staticPath = _ref.static,
        verbose = _ref.verbose,
        callback = _ref.callback,
        port = _ref.port,
        _ref$log = _ref.log,
        log = _ref$log === undefined ? _console2.default.log : _ref$log;

    var app = (0, _express2.default)();

    if (typeof staticPath === 'string' && staticPath) {
        app.use(_express2.default.static(staticPath));
    } else if (Array.isArray(staticPath) && typeof staticPath[1] === 'string' && typeof staticPath[0] === 'string') {
        var _staticPath = (0, _slicedToArray3.default)(staticPath, 2),
            route = _staticPath[0],
            path = _staticPath[1];

        app.use(route, _express2.default.static(path));
    }

    var server = app.listen(port, function (err) {
        app._listening = true;
        var port = server.address().port;
        if (port && verbose) {
            _console2.default.log(' WebpackServer run on', _chalk2.default.underline.red('' + ('http://localhost:' + port + '/')));
        }
        var compiler = (0, _webpack2.default)(webpackConfig);
        app.compiler = compiler;
        app.use((0, _webpackDevMiddleware2.default)(compiler, {
            noInfo: !verbose,
            stats: {
                chunks: false,
                hash: false,
                colors: { level: 2, hasBasic: true, has256: true, has16m: false }
            },
            publicPath: webpackConfig.output && webpackConfig.output.publicPath || '/',
            hot: true,
            quiet: !verbose,
            log: verbose && log
        }));

        app.use((0, _webpackHotMiddleware2.default)(compiler, {
            log: verbose && log
            // path: hmrPath
        }));

        callback && callback(err, port);
    });

    app._server = server;

    return app;
}
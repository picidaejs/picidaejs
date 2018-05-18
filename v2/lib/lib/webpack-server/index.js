'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _temp;

var _events = require('events');

var _serverMaker = require('./serverMaker');

var _serverMaker2 = _interopRequireDefault(_serverMaker);

var _Error = require('../utils/Error');

var _Error2 = _interopRequireDefault(_Error);

var _getWebpackConfig = require('./getWebpackConfig');

var _getWebpackConfig2 = _interopRequireDefault(_getWebpackConfig);

var _webpackConfigUpdater = require('./webpackConfigUpdater');

var _webpackConfigUpdater2 = _interopRequireDefault(_webpackConfigUpdater);

var _console = require('../utils/console');

var _console2 = _interopRequireDefault(_console);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('../utils/fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebpackServer = (_temp = _class = function () {

    /**
     *
     * @param opt
     */
    function WebpackServer(opt) {
        (0, _classCallCheck3.default)(this, WebpackServer);
        this.injectList = [];

        opt = (0, _extends3.default)({}, WebpackServer.defaultOptions, opt);
        this.opt = opt;
        var defaultWebpackConfig = (0, _getWebpackConfig2.default)({ cwd: process.cwd(), dev: this.opt.dev, publicPath: opt.publicPath });
        this.webpackConfig = (0, _webpackConfigUpdater2.default)(this.opt.webpackConfigGetter(defaultWebpackConfig), this.opt.dev);
    }

    (0, _createClass3.default)(WebpackServer, [{
        key: 'getWebpackConfig',
        value: function getWebpackConfig() {
            return this.webpackConfig;
        }
    }, {
        key: 'useInjected',
        value: function useInjected() {
            var _this = this;

            if (this.app && this.app._listening && this.injectList.length) {
                this.injectList.forEach(function (args) {
                    return _this.app.use.apply(_this.app, args);
                });
                this.injectList = [];
            }
        }
    }, {
        key: 'inject',
        value: function inject(routerPatternOrRequestHandler, requestHandler) {
            if (typeof routerPatternOrRequestHandler === 'string') {
                this.injectList.push([routerPatternOrRequestHandler, requestHandler]);
            } else if (typeof routerPatternOrRequestHandler === 'function') {
                this.injectList.push([routerPatternOrRequestHandler]);
            }

            this.useInjected();
            return this;
        }
    }, {
        key: 'start',
        value: function start(_callback) {
            var _this2 = this;

            if (this.app && this.app._server) {
                throw new _Error2.default('WebpackServer is running currently!');
            }
            this.app = (0, _serverMaker2.default)({
                port: this.opt.port,
                callback: function callback(err, port) {
                    _callback && _callback(err, port);
                    _this2.useInjected();
                },
                verbose: this.opt.verbose,
                static: [this.opt.publicPath, _fs2.default.isDirectory(this.opt.static) && this.opt.static],
                webpackConfig: this.webpackConfig
            });

            return this;
        }
    }, {
        key: 'stop',
        value: function stop(callback) {
            if (this.app && this.app._server) {
                this.app._server.close(callback);
                this.app._server = void 0;
                this.app = void 0;
            } else {
                callback(new _Error2.default('WebpackServer isn\'t running'));
            }
            return this;
        }
    }]);
    return WebpackServer;
}(), _class.defaultOptions = {
    port: 8989,
    publicPath: '/',
    webpackConfigGetter: function webpackConfigGetter(config) {
        return config;
    },
    verbose: true,
    static: null,
    dev: true }, _temp);
exports.default = WebpackServer;
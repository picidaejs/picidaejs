'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp;
// import createGlobalRequire from './lib/utils/createGlobalRequire'


var _events = require('events');

var _mkdirp = require('mkdirp');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpackServer = require('./lib/webpack-server');

var _webpackServer2 = _interopRequireDefault(_webpackServer);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _build2 = require('./lib/webpack-server/build');

var _build3 = _interopRequireDefault(_build2);

var _fs = require('./lib/utils/fs');

var _fs2 = _interopRequireDefault(_fs);

var _Error = require('./lib/utils/Error');

var _Error2 = _interopRequireDefault(_Error);

var _loadFront2 = require('./lib/utils/loadFront');

var _arrayAppendAssign = require('./lib/utils/array-append-assign');

var _arrayAppendAssign2 = _interopRequireDefault(_arrayAppendAssign);

var _utils = require('./lib/utils');

var _context8 = require('./lib/utils/context');

var _console = require('./lib/utils/console');

var _console2 = _interopRequireDefault(_console);

var _resolvePath = require('./lib/utils/resolve-path');

var _resolvePath2 = _interopRequireDefault(_resolvePath);

var _filesToTree = require('./lib/utils/files-to-tree');

var _filesToTree2 = _interopRequireDefault(_filesToTree);

var _seoHelper = require('./lib/utils/seo-helper');

var _each = require('./lib/utils/each');

var _each2 = _interopRequireDefault(_each);

var _parseQuery = require('./lib/utils/parse-query');

var _parseQuery2 = _interopRequireDefault(_parseQuery);

var _ruleMatch = require('./lib/utils/rule-match');

var _ruleMatch2 = _interopRequireDefault(_ruleMatch);

var _chcwdFlow = require('./lib/utils/chcwd-flow');

var _chcwdFlow2 = _interopRequireDefault(_chcwdFlow);

var _arrayUnique = require('./lib/utils/array-unique');

var _arrayUnique2 = _interopRequireDefault(_arrayUnique);

var _boss = require('./lib/loaders/common/boss');

var _boss2 = _interopRequireDefault(_boss);

var _summaryGenerator = require('./lib/loaders/data-loader/summary-generator');

var _summaryGenerator2 = _interopRequireDefault(_summaryGenerator);

var _ssr = require('./lib/utils/ssr');

var _ssr2 = _interopRequireDefault(_ssr);

var _checkThemeConfigFile = require('./lib/utils/check-theme-config-file');

var _checkThemeConfigFile2 = _interopRequireDefault(_checkThemeConfigFile);

var _externalExports = require('./lib/utils/externalExports');

var _externalExports2 = _interopRequireDefault(_externalExports);

var _overwriteRequire = require('./lib/utils/overwrite-require');

var over = _interopRequireWildcard(_overwriteRequire);

var _context9 = require('./lib/context');

var _context10 = _interopRequireDefault(_context9);

var _defaultConfig = require('./lib/default-config');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isEqual = require('lodash.isequal');

var isDebug = !!process.env.PICIDAE_DEBUG;
// const require = createGlobalRequire(__dirname)

process.on('uncaughtException', _console2.default.error);
process.on('unhandledRejection', function (err) {
    throw err;
});
over.register();

function _webpackConfigGetter() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // console.log(config.module.loaders)
    return config;
}

function looseRoutesMap() {
    var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    Object.keys(map).forEach(function (key) {
        map[key.replace(/^\/+/, '').replace(/\/+$/, '')] = map[key];
    });
    return map;
}

function generateEntry(fileTree) {
    var routesMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof routesMap !== 'function') {
        routesMap = looseRoutesMap(routesMap);
    }

    // console.log(routesMap);
    function replace(pathname) {
        if (typeof routesMap === 'function') {
            return routesMap(pathname) || pathname;
        }

        var matched = false;
        return pathname.split('/').map(function (chunk) {
            // console.log(chunk);
            if (!matched) {
                if (routesMap[chunk]) {
                    matched = true;
                }
                return typeof routesMap[chunk] === 'string' ? routesMap[chunk] : chunk;
            } else {
                return chunk;
            }
        }).join('/').replace(/\/\//, '/');
    }

    function generateKey() {
        var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var key = arguments[1];

        var id = 1;
        var newKey = key;
        while (newKey in container) {
            newKey = key + '-' + id++;
        }
        return newKey;
    }

    function generateEntryInner(root, fileTree) {
        var container = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if (fileTree.files) {
            fileTree.files.forEach(function (ent) {
                generateEntryInner(_path2.default.join(root, ent.file), ent, container);
            });
        } else {
            var key = replace(root.substring(outRoot.length + 1)).replace(/\.(md|markdown)$/i, '');
            // if (nps.basename(key) === 'index') {
            //     // `api/index` -> 'api/'
            //     key = key.replace(/\/index\s*$/, '/');
            // }
            container[generateKey(container, key)] = {
                path: root,
                lastmod: fileTree.lastmod
            };
        }
        return container;
    }

    var outRoot = fileTree.file;
    /*.replace(/\..*$/, '');*/
    return generateEntryInner(fileTree.file, fileTree);
}

function assignOption(opts) {
    return (0, _arrayAppendAssign2.default)({}, _defaultConfig.value, opts);
}

var Picidae = (_temp = _class = function (_EventEmitter) {
    (0, _inherits3.default)(Picidae, _EventEmitter);

    function Picidae(opts) {
        (0, _classCallCheck3.default)(this, Picidae);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Picidae.__proto__ || Object.getPrototypeOf(Picidae)).call(this));

        _context10.default.__init({ picidae: _this });

        _propTypes2.default.checkPropTypes(_defaultConfig.type, opts, 'config', 'Picidae Configuration');

        _this.opts = assignOption(opts);
        _this.id = _this.opts.id || 'ID';

        // process.stdout.write(chalk.yellow(logoText));
        _this.tmpPath = _path2.default.join(_context8.tmpPath); //, '..', require('md5')(Date.now()).substr(0, 15))
        (0, _mkdirp.sync)(_this.tmpPath);
        var entryFile = _path2.default.join(_this.tmpPath, 'entry.' + _this.id + '.js');
        var tmpThemeDataPath = _path2.default.join(_this.tmpPath, 'theme-data.' + _this.id + '.js');
        var tplHtmlPath = _path2.default.join(_context8.templatePath, 'template.html');
        var customTplHtmlPath = _path2.default.join(_this.opts.templateRoot, 'index.html');
        (0, _mkdirp.sync)(_this.opts.templateRoot);

        !_fs2.default.existsSync(customTplHtmlPath) && _fs2.default.copySync(tplHtmlPath, customTplHtmlPath);

        _this.htmlTempate = customTplHtmlPath;
        _this.themeDataPath = tmpThemeDataPath;
        _this.docPath = _path2.default.resolve(_this.opts.docRoot);
        _this.distRoot = _path2.default.resolve(_this.opts.distRoot);

        // initial webpackServer
        _this.wpServer = new _webpackServer2.default((0, _extends3.default)({}, _this.opts, {
            static: _path2.default.resolve(_this.opts.extraRoot),
            dev: _this.opts.watch,
            webpackConfigGetter: function webpackConfigGetter(config) {
                config.entry = (0, _extends3.default)({}, config.entry, {
                    PICIDAE_ENTRY: entryFile
                    // ...generateEntry(tree)
                });
                config.output.publicPath = _this.opts.publicPath || config.output.publicPath;
                config.output.path = _this.distRoot;

                if (_this.opts.webpackConfigUpdater) {
                    config = _this.opts.webpackConfigUpdater(config, require('webpack'));
                }
                config = _webpackConfigGetter(config);
                return config;
            }
        }));

        _this.opts.transformers = _this.opts.transformers || [];

        function getTransformers(transformers, suffix) {
            transformers = transformers.map(function (str, index) {
                var pureName = str.replace(/\?.*?$/, '');
                var moduleName = _parseQuery2.default.autoPrefix(pureName, 'picidae-transformer-');
                var modulePath = '';
                if (suffix === 'node.js') {
                    try {
                        return (0, _extends3.default)({}, (0, _parseQuery2.default)(str), {
                            path: require.resolve(_resolvePath2.default.isNodeModule(str) ? str : _path2.default.resolve(str)),
                            index: index
                        });
                    } catch (ex) {
                        if (ex.code !== 'MODULE_NOT_FOUND') {
                            _console2.default.error(ex);
                        }
                    }
                }
                try {
                    var name = _parseQuery2.default.injectJoin(moduleName, suffix);
                    modulePath = (0, _resolvePath2.default)(name);

                    if (!_fs2.default.isFile(modulePath)) {
                        return false;
                    }
                } catch (ex) {
                    if (ex.code === 'MODULE_NOT_FOUND') {
                        isDebug && _console2.default.warn('`' + moduleName + '/' + suffix + '` transformer is not found.');
                    } else {
                        _console2.default.error(ex);
                    }
                    return false;
                }

                return (0, _extends3.default)({}, (0, _parseQuery2.default)(_parseQuery2.default.injectJoin(str, suffix), 'picidae-transformer-', { allowNotExists: true }), {
                    index: index
                });
            }).filter(Boolean);

            var map = {};
            var uniques = [];
            transformers.forEach(function (t) {
                if (!map[t.path]) {
                    uniques.push(t);
                }
                map[t.path] = true;
            });
            return uniques;
        }

        var transformers = _this.opts.transformers.slice();
        transformers = [_path2.default.join(__dirname, 'transformers', 'img-loader')].concat(transformers);

        // recursively exports.use
        var len = void 0;
        do {
            len = transformers.length;
            _this.nodeTransformers = getTransformers(transformers, 'node.js');
            (0, _externalExports2.default)(_this.nodeTransformers, transformers);
        } while (transformers.length !== len);
        _this.browserTransformers = getTransformers(transformers, 'browser.js');

        if (isDebug) {
            _console2.default.debug('nodeTransformers', _this.nodeTransformers);
            _console2.default.debug('browserTransformers', _this.browserTransformers);
        }

        _this.watchTheme().then(function () {
            return _this.watchSummary();
        });

        // Write Files for Webpack
        (0, _utils.renderTemplate)(_path2.default.join(_context8.templatePath, 'entry.template.js'), {
            root: _this.opts.publicPath,
            themeDataPath: _resolvePath2.default.toUriPath(tmpThemeDataPath),
            dataSuffix: _this.id,
            sw: !_this.opts.noSw
        }, entryFile);

        return _this;
    }

    (0, _createClass3.default)(Picidae, [{
        key: 'generateSummary',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _this2 = this;

                var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.initialThemeConfig().plugins;
                var tree, opt, result, str, lazyresult;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.summaryPath = _path2.default.join(this.tmpPath, 'data.' + this.id + '.js');
                                this.summarySSrPath = _path2.default.join(this.tmpPath, 'data.' + this.id + '.ssr.js');
                                tree = (0, _filesToTree2.default)(this.docPath, function (filename) {
                                    return (0, _utils.fileIsMarkdown)(filename) && !(0, _ruleMatch2.default)(_this2.opts.excludes, filename);
                                });

                                this.docsEntityEntry = generateEntry(tree, this.routesMap);

                                this.docsEntry = {};
                                (0, _each2.default)(this.docsEntityEntry, function (_ref2, key, index, data) {
                                    var path = _ref2.path;

                                    _this2.docsEntry[key] = path;
                                });

                                opt = {
                                    docsEntityEntry: this.docsEntityEntry,
                                    plugins: plugins,
                                    transformers: this.browserTransformers,
                                    nodeTransformers: this.nodeTransformers,
                                    picker: this.opts.picker || function (a) {
                                        return a;
                                    },
                                    docRoot: this.docPath
                                };

                                if (!this.opts.ssr) {
                                    _context.next = 13;
                                    break;
                                }

                                _context.next = 10;
                                return (0, _summaryGenerator2.default)(this.docsEntry, opt, false);

                            case 10:
                                result = _context.sent;
                                str = _fs2.default.readFileSync(_path2.default.join(_context8.templatePath, 'data-ssr.template.js')).toString();

                                _fs2.default.writeFileSync(this.summarySSrPath, str + '\nmodule.exports = ' + result);

                            case 13:
                                _context.next = 15;
                                return (0, _summaryGenerator2.default)(this.docsEntry, opt, true);

                            case 15:
                                lazyresult = _context.sent;


                                // console.log(`\`${nps.resolve(process.cwd(), this.summaryPath)}\` Updated.`)
                                _fs2.default.writeFileSync(this.summaryPath, 'module.exports = ' + lazyresult);

                            case 17:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function generateSummary() {
                return _ref.apply(this, arguments);
            }

            return generateSummary;
        }()
    }, {
        key: 'watchSummary',
        value: function watchSummary() {
            var _this3 = this;

            if (this.opts.watch) {
                this.summaryLock = false;
                this.summaryWatcher = _chokidar2.default.watch(this.docPath, { ignoreInitial: true });

                this.summaryWatcher.on('all', function () {
                    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(event, path) {
                        var generateSummary, foundPathKey, meta, _loadFront, __content, realMeta;

                        return _regenerator2.default.wrap(function _callee3$(_context3) {
                            while (1) {
                                switch (_context3.prev = _context3.next) {
                                    case 0:
                                        // change
                                        // add
                                        // remove
                                        // ...

                                        // TODO
                                        // this.docsEntry -> should fill assets firstly
                                        generateSummary = function () {
                                            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                                    while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                            case 0:
                                                                _context2.prev = 0;
                                                                _context2.next = 3;
                                                                return _this3.generateSummary();

                                                            case 3:
                                                                _context2.next = 8;
                                                                break;

                                                            case 5:
                                                                _context2.prev = 5;
                                                                _context2.t0 = _context2['catch'](0);

                                                                _console2.default.error(_context2.t0);

                                                            case 8:
                                                            case 'end':
                                                                return _context2.stop();
                                                        }
                                                    }
                                                }, _callee2, _this3, [[0, 5]]);
                                            }));

                                            return function generateSummary() {
                                                return _ref4.apply(this, arguments);
                                            };
                                        }();

                                        if (!(0, _ruleMatch2.default)(_this3.opts.hotReloadTests, path)) {
                                            _context3.next = 17;
                                            break;
                                        }

                                        _console2.default.log('Detect File ' + event + ' :', _path2.default.relative(_this3.docPath, path));

                                        foundPathKey = Object.keys(_this3.docsEntry).find(function (key) {
                                            return _this3.docsEntry[key] === path;
                                        });

                                        if (!(foundPathKey != null && _this3.docsEntityEntry[foundPathKey])) {
                                            _context3.next = 15;
                                            break;
                                        }

                                        meta = _this3.docsEntityEntry[foundPathKey].meta;

                                        if (!(_fs2.default.isFile(path) && /\.(md|markdown)$/i.test(path))) {
                                            _context3.next = 13;
                                            break;
                                        }

                                        _loadFront = (0, _loadFront2.loadFront)(_fs2.default.readFileSync(path).toString()), __content = _loadFront.__content, realMeta = (0, _objectWithoutProperties3.default)(_loadFront, ['__content']);

                                        isDebug && _console2.default.debug('newMeta:', realMeta, ', oldMeta:', meta);
                                        // updated meta

                                        if (isEqual(realMeta, meta)) {
                                            _context3.next = 13;
                                            break;
                                        }

                                        isDebug && _console2.default.debug('updated meta');
                                        _context3.next = 13;
                                        return generateSummary();

                                    case 13:
                                        _context3.next = 17;
                                        break;

                                    case 15:
                                        _context3.next = 17;
                                        return generateSummary();

                                    case 17:
                                    case 'end':
                                        return _context3.stop();
                                }
                            }
                        }, _callee3, _this3);
                    }));

                    return function (_x7, _x8) {
                        return _ref3.apply(this, arguments);
                    };
                }());
            }
        }
    }, {
        key: 'watchTheme',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var _this4 = this;

                var _initialThemeConfig, themeConfigFiles, root, notFound, routes, themeConfig, plugins, _themeConfig$routesMa, routesMap, config;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _initialThemeConfig = this.initialThemeConfig(), themeConfigFiles = _initialThemeConfig.themeConfigFiles, root = _initialThemeConfig.root, notFound = _initialThemeConfig.notFound, routes = _initialThemeConfig.routes, themeConfig = _initialThemeConfig.themeConfig, plugins = _initialThemeConfig.plugins;


                                try {
                                    delete require.cache[require.resolve(this.themeDataPath)];
                                } catch (ex) {}

                                // initial Watcher
                                if (this.opts.watch && themeConfigFiles.length) {
                                    this.themeWatcher = _chokidar2.default.watch(themeConfigFiles, { persistent: true, ignoreInitial: true });
                                    this.themeWatcher.on('all', function (event, path, stat) {
                                        _console2.default.log(path, ':', event);
                                        _this4.themeWatcher.close();
                                        _this4.themeWatcher = null;
                                        _this4.watchTheme();
                                    });
                                }

                                // Write Routes/ThemeConfig to file
                                _themeConfig$routesMa = themeConfig.routesMap, routesMap = _themeConfig$routesMa === undefined ? {} : _themeConfig$routesMa, config = (0, _objectWithoutProperties3.default)(themeConfig, ['routesMap']);

                                this.routesMap = routesMap;
                                (0, _utils.renderTemplate)(_path2.default.join(_context8.templatePath, 'commonjs.template.js'), { body: JSON.stringify({ root: _resolvePath2.default.toUriPath(root), notFound: notFound, routes: routes, themeConfig: config }) }, this.themeDataPath);

                                this.opts.ssr && (0, _utils.renderTemplate)(_path2.default.join(_context8.templatePath, 'routes-generator.template.js'), { root: _resolvePath2.default.toUriPath(root), /*routesMap: JSON.stringify(routesMap), */dataSuffix: this.id + '.ssr' }, _path2.default.join(this.tmpPath, 'routes-generator.' + this.id + '.ssr.js'));

                                (0, _utils.renderTemplate)(_path2.default.join(_context8.templatePath, 'routes-generator.template.js'), { root: _resolvePath2.default.toUriPath(root), /*routesMap: JSON.stringify(routesMap), */dataSuffix: this.id }, _path2.default.join(this.tmpPath, 'routes-generator.' + this.id + '.js'));
                                _context4.prev = 8;
                                _context4.next = 11;
                                return this.generateSummary(plugins);

                            case 11:
                                _context4.next = 17;
                                break;

                            case 13:
                                _context4.prev = 13;
                                _context4.t0 = _context4['catch'](8);

                                _console2.default.error(_context4.t0);
                                return _context4.abrupt('return');

                            case 17:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[8, 13]]);
            }));

            function watchTheme() {
                return _ref5.apply(this, arguments);
            }

            return watchTheme;
        }()
    }, {
        key: 'clearTmp',
        value: function clearTmp() {
            !isDebug && require('del').sync([_path2.default.join(this.tmpPath, '*' + this.id + '*')], { force: true });
        }
    }, {
        key: 'build',
        value: function build(callback) {
            var _this5 = this;

            _console2.default.log(_chalk2.default.green('Building...'));
            if (this.opts.force) {
                _console2.default.log(_chalk2.default.red(' FORCE Mode is OPEN'));
                require('del').sync([_path2.default.join(this.distRoot, '*'), '!' + _path2.default.join(this.distRoot, '.git')], { force: true });
            }
            if (!this.opts.ssr) {
                _console2.default.log(_chalk2.default.red(' SSR Mode is CLOSED'));
            }
            if (!this.opts.noSpider) {
                _console2.default.log(_chalk2.default.green(' Spider Mode is OPEN'));
            }

            var webpackConfig = this.wpServer.getWebpackConfig();
            if (this.opts.sourceMap) {
                webpackConfig.devtool = 'source-map';
            }
            (0, _build3.default)(webpackConfig, function () {
                _console2.default.log(_chalk2.default.green('\n Webpack Build successfully.') + '\n');

                // let
                var ssrWebpackConfig = webpackConfig;
                var ssrEntryName = 'node-routes-generator.' + _this5.id;
                var ssrEntryPath = _path2.default.join(_this5.tmpPath, 'routes-generator.' + _this5.id + '.ssr.js');
                ssrWebpackConfig.devtool = null;
                ssrWebpackConfig.entry = (0, _defineProperty3.default)({}, ssrEntryName, [ssrEntryPath]);
                ssrWebpackConfig.target = 'node';
                // // https://github.com/webpack/webpack/issues/1599
                // ssrWebpackConfig.node = {
                //     __dirname: false,
                //     __filename: false
                // };
                ssrWebpackConfig.output = Object.assign({}, ssrWebpackConfig.output, {
                    path: _this5.tmpPath,
                    library: 'ssr',
                    libraryTarget: 'commonjs'
                });

                var ignorePluginsType = isDebug ? [_webpack2.default.optimize.CommonsChunkPlugin, _webpack2.default.DefinePlugin, _webpack2.default.optimize.UglifyJsPlugin] : [_webpack2.default.optimize.CommonsChunkPlugin, _webpack2.default.optimize.UglifyJsPlugin];

                ssrWebpackConfig.plugins = ssrWebpackConfig.plugins.filter(function (plugin) {
                    return ignorePluginsType.findIndex(function (Type) {
                        return plugin instanceof Type;
                    }) < 0;
                });

                if (isDebug) {
                    ssrWebpackConfig.debug = true;
                    ssrWebpackConfig.plugins.push(new _webpack2.default.DefinePlugin({
                        'process.env.NODE_ENV': '"development"'
                    }));
                }

                var themeSSR = null;
                try {
                    _this5.themeSSRPath = (0, _resolvePath2.default)(_this5.themeSSRPath);
                    themeSSR = require(_this5.themeSSRPath);
                    _console2.default.log('Found ssr module of theme:\n   ', _path2.default.relative(process.cwd(), _this5.themeSSRPath));
                } catch (ex) {
                    if (ex.code !== 'MODULE_NOT_FOUND') {
                        _console2.default.error(ex);
                    }
                    _this5.themeSSRPath = null;
                }

                ssrWebpackConfig.externals = ssrWebpackConfig.externals || [];
                if (!Array.isArray(ssrWebpackConfig.externals)) {
                    ssrWebpackConfig.externals = [ssrWebpackConfig.externals];
                }

                var configExternals = ssrWebpackConfig.externals;
                configExternals.push([function (context, request, callback) {
                    if (/^\s*picidae-/.test(request)) {
                        return callback();
                    }
                    if (/^\s*!/.test(request)) {
                        return callback();
                    }
                    if (_resolvePath2.default.isNodeModule(request)) {
                        // external!
                        return callback(null, 'commonjs ' + request);
                    }
                    return callback();
                }]);

                var externals = themeSSR && themeSSR.externals;
                if (externals) {
                    configExternals.push(externals);

                    if (isDebug) {
                        _console2.default.debug('webpack.externals', ssrWebpackConfig.externals);
                    } else {
                        _console2.default.log('theme ssr\'s externals: ', externals);
                    }
                }

                if (typeof _this5.opts.ssrWebpackConfigUpdater === 'function') {
                    ssrWebpackConfig = _this5.opts.ssrWebpackConfigUpdater(ssrWebpackConfig);
                }

                var themeNodeModulePath = _path2.default.join(_path2.default.dirname(_this5.themePath), 'node_modules');
                if (!!ssrWebpackConfig.resolve && !!ssrWebpackConfig.resolve.root) {
                    if (!Array.isArray(ssrWebpackConfig.resolve.root)) {
                        ssrWebpackConfig.resolve.root = [ssrWebpackConfig.resolve.root];
                    }
                    !ssrWebpackConfig.resolve.root.includes(themeNodeModulePath) && ssrWebpackConfig.resolve.root.push(themeNodeModulePath);
                }
                if (!!ssrWebpackConfig.resolveLoader && !!ssrWebpackConfig.resolveLoader.root) {
                    if (!Array.isArray(ssrWebpackConfig.resolveLoader.root)) {
                        ssrWebpackConfig.resolveLoader.root = [ssrWebpackConfig.resolveLoader.root];
                    }
                    !ssrWebpackConfig.resolveLoader.root.includes(themeNodeModulePath) && ssrWebpackConfig.resolveLoader.root.push(themeNodeModulePath);
                }

                var buildMethod = _this5.opts.ssr ? _build3.default : function (config, callback) {
                    return callback(null);
                };
                buildMethod(ssrWebpackConfig, function () {
                    var _pool;

                    var routes = require(_this5.themeDataPath).routes;
                    var method = function method(url, callback) {
                        return callback('');
                    };
                    var sitemap = require('./lib/utils/sitemap-generator');
                    if (_this5.opts.ssr) {
                        over.logout();
                        over.register(_this5.themeSSRPath || void 0);
                        var gen = require(_path2.default.join(_this5.tmpPath, ssrEntryName)).ssr;
                        routes = gen(require(_this5.themeDataPath));
                        method = (0, _ssr2.default)(routes, false, _this5.opts.publicPath);
                    }

                    var methodProm = function methodProm(path) {
                        return new Promise(function (resolve, reject) {
                            method(path, function (content, props) {
                                if (content == null) {
                                    resolve();
                                }
                                resolve(content);
                            });
                        });
                    };

                    var sites = sitemap(routes, _this5.docsEntry);
                    var tpl = _fs2.default.readFileSync(_this5.htmlTempate).toString();

                    var pool = [];
                    (_pool = pool).push.apply(_pool, (0, _toConsumableArray3.default)(sites));

                    var count = 1;

                    function logPath(path) {
                        count++;
                        _console2.default.log(_chalk2.default.green(' `' + _path2.default.relative(process.cwd(), path) + '`'), 'File Created successfully.');
                    }

                    var createProm = function createProm(sites, ctxData) {
                        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                        var publicPath = ctxData.publicPath,
                            dirRoot = ctxData.dirRoot,
                            templateData = ctxData.templateData;
                        var _opt$noSpider = opt.noSpider,
                            noSpider = _opt$noSpider === undefined ? false : _opt$noSpider;


                        return Promise.all(sites.map(function (_ref6) {
                            var path = _ref6.path,
                                html = _ref6.html;

                            var absoluteHtml = _path2.default.join(dirRoot, html.replace(/^\/+/, ''));
                            (0, _mkdirp.sync)(_path2.default.dirname(absoluteHtml));
                            return new Promise(function (resolve, reject) {
                                method('/' + path.replace(/^\/+/, ''), function () {
                                    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(content, renderProps) {
                                        var opts, inputArg, themeTemplateData, actualTemplateData;
                                        return _regenerator2.default.wrap(function _callee5$(_context5) {
                                            while (1) {
                                                switch (_context5.prev = _context5.next) {
                                                    case 0:
                                                        if (content == null) {
                                                            resolve();
                                                        } else {
                                                            opts = { path: absoluteHtml, pathname: path, spider: true
                                                                // try {
                                                            };
                                                            inputArg = (0, _extends3.default)({}, renderProps);
                                                            themeTemplateData = null;

                                                            if (themeSSR && typeof themeSSR === 'function') {
                                                                themeTemplateData = themeSSR(inputArg);
                                                            }
                                                            actualTemplateData = typeof templateData === 'function' ? templateData(inputArg, 'prod') : templateData;

                                                            actualTemplateData = (0, _extends3.default)({}, actualTemplateData) || {};
                                                            actualTemplateData.themeData = themeTemplateData || {};
                                                            _boss2.default.queue({
                                                                type: 'renderHtml',
                                                                args: [tpl, (0, _extends3.default)({ content: content, root: publicPath }, actualTemplateData), opts],
                                                                callback: function callback(err, obj) {
                                                                    if (err || !obj) resolve();else {
                                                                        logPath(obj.path);
                                                                        if (!noSpider) {
                                                                            var newSites = obj.hrefList.map(function (href) {
                                                                                if (href.startsWith(publicPath)) {
                                                                                    href = href.substring(publicPath.length);
                                                                                    href = href.startsWith('/') ? href : '/' + href;
                                                                                }
                                                                                return href;
                                                                            }).filter(function (href) {
                                                                                return !pool.find(function (x) {
                                                                                    return x.path === decodeURIComponent(href);
                                                                                });
                                                                            });
                                                                            newSites = newSites.map(sitemap.transform);
                                                                            if (newSites && newSites.length) {
                                                                                _console2.default.log(path, '->', newSites);
                                                                                pool = pool.concat(newSites);
                                                                                resolve(createProm(newSites, ctxData, { noSpider: noSpider }));
                                                                                return;
                                                                            }
                                                                        }
                                                                        resolve(obj.path);
                                                                    }
                                                                }
                                                            });
                                                        }

                                                    case 1:
                                                    case 'end':
                                                        return _context5.stop();
                                                }
                                            }
                                        }, _callee5, _this5);
                                    }));

                                    return function (_x10, _x11) {
                                        return _ref7.apply(this, arguments);
                                    };
                                }());
                            }).catch(_console2.default.error);
                        }));
                    };

                    var ctxData = {
                        dirRoot: _this5.distRoot,
                        publicPath: _this5.opts.publicPath,
                        templateData: _this5.opts.templateData
                    };
                    createProm(sites, ctxData, { noSpider: _this5.opts.noSpider }).then((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                        var src, target, _sites, host, sitemapText, robotsText, writeFile;

                        return _regenerator2.default.wrap(function _callee6$(_context6) {
                            while (1) {
                                switch (_context6.prev = _context6.next) {
                                    case 0:
                                        over.logout();
                                        _boss2.default.jobDone();
                                        src = _path2.default.resolve(_this5.opts.extraRoot);
                                        target = _path2.default.join(_this5.distRoot);


                                        _console2.default.log('');
                                        _console2.default.log(_chalk2.default.green(' ' + count), 'Files Created successfully\n');

                                        // precache services-worker.js

                                        if (_this5.opts.noSw) {
                                            _context6.next = 9;
                                            break;
                                        }

                                        _context6.next = 9;
                                        return require('sw-precache').write(_path2.default.join(_this5.distRoot, 'service-worker.js'), {
                                            staticFileGlobs: [_path2.default.join(_this5.distRoot, '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}')],
                                            stripPrefix: _this5.distRoot,
                                            navigateFallback: _path2.default.join(_this5.opts.publicPath, 'index.html'),
                                            replacePrefix: _this5.opts.publicPath.replace(/\/+$/, ''),
                                            templateFilePath: _path2.default.join(_context8.templatePath, 'service-worker.tmpl'),
                                            logger: function logger(message) {
                                                _console2.default.log(message);
                                            },
                                            maximumFileSizeToCacheInBytes: 4194304 // 4MB
                                        });

                                    case 9:

                                        if (_this5.opts.ssr && _this5.opts.host) {
                                            if (_this5.docsEntityEntry['index']) {
                                                _this5.docsEntityEntry[''] = _this5.docsEntityEntry['index'];
                                                delete _this5.docsEntityEntry['index'];
                                            }
                                            _sites = [];

                                            (0, _each2.default)(_this5.docsEntityEntry, function (val, key) {
                                                _sites.push({
                                                    loc: key,
                                                    lastmod: val.lastmod
                                                });
                                            });

                                            host = _url2.default.resolve(_this5.opts.host, _this5.opts.publicPath);

                                            _sites = (0, _arrayUnique2.default)(_sites.concat(pool.filter(function (_ref9) {
                                                var path = _ref9.path;
                                                return path !== 'NOT_FOUND_PAGE';
                                            }).map(function (_ref10) {
                                                var path = _ref10.path;
                                                return path.replace(/^\/*/, '');
                                            })), function (obj) {
                                                return typeof obj === 'string' ? obj : obj.loc;
                                            });
                                            sitemapText = (0, _seoHelper.toSitemap)({ host: host, minify: true, sites: _sites });
                                            robotsText = (0, _seoHelper.toRobots)(host);

                                            writeFile = function writeFile(filename, data, logText) {
                                                _fs2.default.writeFileSync(filename, data);
                                                _console2.default.log(_chalk2.default.cyan(logText), 'File Created');
                                            };

                                            writeFile(_path2.default.join(_this5.distRoot, 'robots.txt'), robotsText, 'robots.txt');
                                            writeFile(_path2.default.join(_this5.distRoot, 'sitemap.xml'), sitemapText, 'sitemap.xml');
                                        }

                                        if (_fs2.default.existsSync(src) && _fs2.default.statSync(src).isDirectory()) {
                                            _console2.default.log(_chalk2.default.green(' Copying Extra Directory'));
                                            (0, _mkdirp.sync)(target);
                                            require('copy-dir').sync(src, target);
                                        }

                                        _console2.default.log(_chalk2.default.green(' Done!  :P'));
                                        callback && callback();

                                    case 13:
                                    case 'end':
                                        return _context6.stop();
                                }
                            }
                        }, _callee6, _this5);
                    }))).catch(_console2.default.error);
                });
            });
        }
    }, {
        key: 'initialThemeConfig',
        value: function initialThemeConfig() {
            var theme = _parseQuery2.default.autoPrefix(this.opts.theme, 'picidae-theme-');
            var themeKey = _resolvePath2.default.isNodeModule(this.opts.theme) ? theme : 'default';
            var themePath = this.themePath = _resolvePath2.default.isNodeModule(this.opts.theme) ? (0, _resolvePath2.default)(theme) : _path2.default.join((0, _resolvePath2.default)(this.opts.theme), 'index.js');
            this.themeSSRPath = _resolvePath2.default.isNodeModule(theme) ? _parseQuery2.default.injectJoin(theme, 'ssr.js') : _parseQuery2.default.injectJoin(theme, 'ssr.js');

            var themeConfigsRoot = _path2.default.resolve(this.opts.themeConfigsRoot);
            var themeConfigFile = _path2.default.join(themeConfigsRoot, themeKey);
            var themeConfigFiles = [themePath, themeConfigFile];

            if (this.opts.watch) {
                try {
                    delete require.cache[require.resolve(themePath)];
                    delete require.cache[require.resolve(themeConfigFile)];
                } catch (ex) {}
            }

            var themeConfigOrigin = require(themePath).default || require(themePath);
            (0, _checkThemeConfigFile2.default)(themeConfigOrigin);
            var root = themeConfigOrigin.root,
                routes = themeConfigOrigin.routes,
                notFound = themeConfigOrigin.notFound,
                picker = themeConfigOrigin.picker,
                _themeConfigOrigin$co = themeConfigOrigin.config,
                themeConfig = _themeConfigOrigin$co === undefined ? {} : _themeConfigOrigin$co,
                _themeConfigOrigin$pl = themeConfigOrigin.plugins,
                plugins = _themeConfigOrigin$pl === undefined ? [] : _themeConfigOrigin$pl;


            (0, _chcwdFlow2.default)(_path2.default.dirname(themePath), function () {
                plugins = ['utils'].concat(plugins);
                plugins = plugins.map(function (f) {
                    return (0, _parseQuery2.default)(f, 'picidae-plugin-');
                });
                root = _path2.default.resolve(root);
            });

            this.opts.picker = picker;

            var found = false;
            try {
                themeConfigFile = require.resolve(themeConfigFile);
                found = true;
            } catch (ex) {
                themeConfigFile = themePath;
            }
            if (found) {
                themeConfig = require(themeConfigFile);
            }
            _console2.default.log(_chalk2.default.gray('Theme Configuration In File: '));
            _console2.default.log('    ', _chalk2.default.green(_path2.default.relative(process.cwd(), require.resolve(themeConfigFile))));

            this.opts.themeConfig = themeConfig;

            themeConfigFiles = themeConfigFiles.map(function (x) {
                try {
                    return require.resolve(x);
                } catch (ex) {
                    return false;
                }
            }).filter(Boolean);

            return {
                themeConfigFiles: themeConfigFiles,
                root: root,
                notFound: notFound,
                routes: routes,
                themeConfig: themeConfig,
                plugins: plugins
            };
        }
    }, {
        key: 'start',
        value: function start(callback) {
            var _this6 = this;

            if (this.opts.ssr) {
                _console2.default.log(_chalk2.default.underline.blue('Server Side Render Model is OPEN.'));
            }

            this.wpServer.start(callback);
            Object.defineProperty(this, 'compiler', {
                enumerable: true,
                configurable: false,
                get: function get() {
                    return _this6.wpServer.app.compiler;
                }
            });
            if (typeof this.opts.expressSetup === 'function') {
                this.opts.expressSetup(this.wpServer.app);
            }
            this.wpServer.inject(function () {
                var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
                    var templateData, gen, routes;
                    return _regenerator2.default.wrap(function _callee7$(_context7) {
                        while (1) {
                            switch (_context7.prev = _context7.next) {
                                case 0:
                                    res.type('html');

                                    templateData = _this6.opts.templateData || {};

                                    if (!(typeof templateData === 'function')) {
                                        _context7.next = 8;
                                        break;
                                    }

                                    _context7.next = 5;
                                    return templateData({}, 'dev');

                                case 5:
                                    _context7.t0 = _context7.sent;
                                    _context7.next = 9;
                                    break;

                                case 8:
                                    _context7.t0 = (0, _extends3.default)({}, templateData);

                                case 9:
                                    templateData = _context7.t0;

                                    // Fake ThemeData
                                    templateData.themeData = {};

                                    if (!_this6.opts.ssr) {
                                        _context7.next = 16;
                                        break;
                                    }

                                    gen = require(_path2.default.join(_this6.tmpPath, 'routes-generator.' + _this6.id + '.ssr.js'));
                                    routes = gen(require(_this6.themeDataPath));

                                    (0, _ssr2.default)(routes, true, _this6.opts.publicPath)(req.url, function (content) {
                                        res.send((0, _utils.renderTemplate)(_this6.htmlTempate, (0, _extends3.default)({
                                            content: content,
                                            root: _this6.opts.publicPath
                                        }, templateData)));
                                    });
                                    return _context7.abrupt('return');

                                case 16:

                                    res.send((0, _utils.renderTemplate)(_this6.htmlTempate, (0, _extends3.default)({
                                        content: '',
                                        root: _this6.opts.publicPath
                                    }, templateData)));

                                case 17:
                                case 'end':
                                    return _context7.stop();
                            }
                        }
                    }, _callee7, _this6);
                }));

                return function (_x12, _x13) {
                    return _ref11.apply(this, arguments);
                };
            }());
        }
    }, {
        key: 'stop',
        value: function stop(callback) {
            if (!this.wpServer) {
                // throw new Error('WebpackServer is NOT running currently!')
            }
            this.clearTmp();
            this.themeWatcher && this.themeWatcher.close();
            this.themeWatcher = null;
            this.summaryWatcher && this.summaryWatcher.close();
            this.summaryWatcher = null;
            this.wpServer && this.wpServer.stop(callback);
            this.wpServer = null;
        }
    }]);
    return Picidae;
}(_events.EventEmitter), _class.assignOption = assignOption, _temp);


module.exports = Picidae;
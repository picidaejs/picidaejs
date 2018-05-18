'use strict';

// for overwrite ssr require

var resolvePath = require('resolve');
var rlv = require('./resolve-path');
var chalk = require('chalk');

var Module = require('module');
var nps = require('path');
var _resolveFilename = Module._resolveFilename;

var pkgIsInGlobal = false;
var rootPath = nps.join(__dirname, '../../..');

var _require = require(nps.join(rootPath, 'package.json')),
    main = _require.main,
    localVersion = _require.version,
    devDependencies = _require.devDependencies,
    dependencies = _require.dependencies;

var localRoot = nps.join(rootPath, main);
var workRoot = void 0;
try {
    workRoot = resolvePath.sync('picidae', { basedir: process.cwd() });
    if (workRoot) {
        pkgIsInGlobal = false;
    }
    // = localRoot !== workRoot
} catch (ex) {
    pkgIsInGlobal = true;
}

/**
 * overwrite `require/require.resolve` for supporting picidae in global
 * @type {{register(): void, logout(): void}}
 */
module.exports = {
    logPkgLocation: function logPkgLocation() {
        var version = pkgIsInGlobal ? localVersion : require(nps.join(workRoot, '../../package.json')).version;

        console.log('\n  ', chalk.cyan.bold('🐦 Picidae v' + version), 'running in', pkgIsInGlobal ? 'the global' : 'the local');
    },
    getInfo: function getInfo() {
        return {
            type: pkgIsInGlobal ? 'global' : 'local',
            path: {
                localRoot: localRoot,
                workRoot: workRoot,
                rootPath: rootPath
            }
        };
    },
    register: function register(picidaInnerBaseDir) {
        if (pkgIsInGlobal && _resolveFilename === Module._resolveFilename) {
            Module._resolveFilename = function (req, parent, isMain, opts) {
                var path = void 0;
                var error = void 0;
                if (resolvePath.isCore(req)) {
                    return _resolveFilename.apply(this, arguments);
                }
                var from = nps.dirname(parent.filename);

                try {
                    // picidae 内部代码 require
                    // 可能是 require transformer/theme/...
                    // 优先找 工作目录下的 依赖
                    if (from.startsWith(rootPath) && !dependencies.hasOwnProperty(req)) {
                        try {
                            path = resolvePath.sync(req, { basedir: process.cwd() });
                        } catch (ex) {
                            try {
                                // react-document-title in theme ssr
                                if (picidaInnerBaseDir) {
                                    path = resolvePath.sync(req, { basedir: picidaInnerBaseDir });
                                }
                            } catch (ex) {}
                        }
                    }
                    if (!path) {
                        path = resolvePath.sync(req, { basedir: from });
                    }
                } catch (e) {
                    error = e;
                    try {
                        path = resolvePath.sync(req, { basedir: process.cwd() });
                    } catch (ex) {
                        error = ex;
                        try {
                            path = resolvePath.sync(req, { basedir: workRoot });
                        } catch (exx) {
                            error = exx;
                            try {
                                path = _resolveFilename.apply(this, arguments);
                            } catch (exxx) {
                                error = exxx;
                            }
                        }
                    }
                }
                if (!path) {
                    req = req.trim();
                    if (req === 'picidae' || req.startsWith('picidae/')) {
                        var root = nps.join(__dirname, '../../..');
                        var rPath = req.replace(/^picidae\/?/, '');
                        path = require.resolve(nps.join(root, rPath));
                    } else {
                        throw error;
                    }
                }
                return path;
            };
        }
    },
    logout: function logout() {
        Module._resolveFilename = _resolveFilename;
    }
};
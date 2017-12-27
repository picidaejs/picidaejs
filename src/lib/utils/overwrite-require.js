// for overwrite ssr require

const resolvePath = require('resolve')
const chalk = require('chalk')

const Module = require('module')
const nps = require('path')
const _resolveFilename = Module._resolveFilename
const originRequire = Module.prototype.require


let pkgIsInGlobal = false
const rootPath = nps.join(__dirname, '../../..')
const { main, version: localVersion, devDependencies, dependencies } = require(nps.join(rootPath, 'package.json'))
const localRoot = nps.join(rootPath, main)
let workRoot
try {
    workRoot = resolvePath.sync('picidae', { basedir: process.cwd() })
    if (workRoot) {
        pkgIsInGlobal = false
    }
    // = localRoot !== workRoot
} catch (ex) {
    pkgIsInGlobal = true
}

/**
 * overwrite `require/require.resolve` for supporting picidae in global
 * @type {{register(): void, logout(): void}}
 */
module.exports = {
    logPkgLocation() {
        var version = pkgIsInGlobal ? localVersion : require(nps.join(workRoot, '../../package.json')).version

        console.log('\n  ', chalk.cyan.bold('🐦 Picidae v' + version), 'running in', pkgIsInGlobal ? 'the global' : 'the local')
    },
    getInfo() {
        return {
            type: pkgIsInGlobal ? 'global' : 'local',
            path: {
                localRoot,
                workRoot,
                rootPath
            }
        }
    },
    register() {
        if (pkgIsInGlobal && _resolveFilename === Module._resolveFilename) {
            Module.prototype.require = function (modulePath) {
                if (modulePath.startsWith('.')) {
                    return originRequire.apply(this, arguments)
                }
                try {
                    return originRequire.apply(this, arguments)
                } catch (ex) {
                    arguments[0] = require.resolve(modulePath)
                }
                return originRequire.apply(this, arguments)
            }
            Module._resolveFilename = function (req, parent, isMain, opts) {
                let path
                let error
                if (resolvePath.isCore(req)) {
                    return _resolveFilename.apply(this, arguments)
                }
                const from = nps.dirname(parent.filename)

                try {
                    // picidae 内部代码 require
                    // 可能是 require transformer/theme/...
                    // 优先找 工作目录下的 依赖
                    if (from.startsWith(rootPath) && !dependencies.hasOwnProperty(req)) {
                        try {
                            path = resolvePath.sync(req, { basedir: process.cwd() })
                        } catch (ex) {}
                    }
                    if (!path) {
                        path = resolvePath.sync(req, { basedir: from })
                    }
                } catch (e) {
                    error = e
                    try {
                        path = resolvePath.sync(req, { basedir: process.cwd() })
                    } catch (ex) {
                        error = ex
                        try {
                            path = _resolveFilename.apply(this, arguments)
                        } catch (exx) {
                            error = exx
                        }
                    }
                }
                if (!path) {
                    req = req.trim()
                    if (req === 'picidae' || req.startsWith('picidae/')) {
                        const root = nps.join(__dirname, '../../..')
                        const rPath = req.replace(/^picidae\/?/, '')
                        path = require.resolve(nps.join(root, rPath))
                    } else {
                        throw error
                    }
                }
                return path
            }
        }
    },
    logout() {
        Module.prototype.require = originRequire
        Module._resolveFilename = _resolveFilename
    }
}


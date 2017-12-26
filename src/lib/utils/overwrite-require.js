// for overwrite ssr require
import console from './console'

const resolvePath = require('resolve')

const Module = require('module')
const nps = require('path')
const _resolveFilename = Module._resolveFilename
const originRequire = Module.prototype.require

let pkgIsInGlobal = false
try {
    const { main } = require(nps.join(__dirname, '../../..', 'package.json'))
    const localRoot = nps.join(__dirname, '../../..', main)
    const workRoot = resolvePath.sync('picidae', { basedir: process.cwd() })
    pkgIsInGlobal = localRoot !== workRoot
} catch (ex) {
    pkgIsInGlobal = true
}

/**
 * overwrite `require/require.resolve` for supporting picidae in global
 * @type {{register(): void, logout(): void}}
 */
module.exports = {
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
                try {
                    path = resolvePath.sync(req, { basedir: process.cwd() } )
                } catch (e) {
                    error = e
                    try {
                        path = _resolveFilename.apply(this, arguments)
                    } catch (ex) {
                        error = ex
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


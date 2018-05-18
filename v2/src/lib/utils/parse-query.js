const loaderUtils = require('loader-utils')
const nps = require('path')
const resolve = require('./resolve-path')

function autoPrefix(path, prefix) {
    prefix = prefix.trim()
    path = path.trim()
    if (resolve.isNodeModule(path)) {
        path = !path.startsWith(prefix) ? prefix + path : path
    }
    return path
}

const parser = function (path, prefix = '', opts = {}) {
    const { allowNotExists = false } = opts
    let index = path.lastIndexOf('?')
    let opt = {}
    if (index >= 0) {
        opt = loaderUtils.parseQuery(path.substring(index))
        path = path.substring(0, index)
    }

    path = autoPrefix(path, prefix)
    try {
        path = resolve(path)
    } catch (ex) {
        if (allowNotExists) {
            return null
        }
        throw ex
    }
    return {
        opt,
        path
    }
}

parser.injectJoin = function (target, ...tails) {
    let tail = nps.join.apply(null, tails)
    let index = target.lastIndexOf('?')
    if (index >= 0) {
        return target.substring(0, index).replace(/\/*$/, '/') + tail.replace(/^\/+/, '') + target.substring(index)
    }
    return target.replace(/\/*$/, '/') + tail.replace(/^\/+/, '')
}

// console.error(injectJoin('render-react?a=22', 'index.js'));

// console.log(parser(injectJoin('dom?a=22', 'index.js'), 'react-'))

parser.autoPrefix = autoPrefix

module.exports = parser




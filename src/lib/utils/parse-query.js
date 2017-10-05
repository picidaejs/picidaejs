
const loaderUtils = require('loader-utils')
const resolve = require('./resolve-path')

module.exports = function (path, prefix = '') {
    let index = path.lastIndexOf('?');
    let opt = {}
    if (index >= 0) {
        opt = loaderUtils.parseQuery(path.substring(index));
        path = path.substring(0, index);
    }

    prefix = prefix.trim()
    path = path.trim()
    if (resolve.isNodeModule(path)) {
        path = !path.startsWith(prefix) ? prefix + path : path;
    }

    return {
        opt,
        path: resolve(path)
    }
}
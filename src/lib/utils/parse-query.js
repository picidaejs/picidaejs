
const loaderUtils = require('loader-utils')
const resolve = require('./resolve-path')

function autoPrefix (path, prefix) {
    prefix = prefix.trim()
    path = path.trim()
    if (resolve.isNodeModule(path)) {
        path = !path.startsWith(prefix) ? prefix + path : path;
    }
    return path
}

const parser = function (path, prefix = '') {
    let index = path.lastIndexOf('?');
    let opt = {}
    if (index >= 0) {
        opt = loaderUtils.parseQuery(path.substring(index));
        path = path.substring(0, index);
    }

    path = autoPrefix(path, prefix)

    return {
        opt,
        path: resolve(path)
    }
}

parser.autoPrefix = autoPrefix

module.exports = parser




const nps = require('path')

function resolve(path, ...paths /*, paths*/) {
    assertPath(path);
    path = nps.join.apply(nps, arguments)

    if (isRelative(path)) {
        return nps.resolve(path);
    }
    if (nps.isAbsolute(path)) {
        return path;
    }

    return require.resolve(path);
}
const Resolve = resolve

Resolve.isNodeModule = isNodeModule;
function isNodeModule (path) {
    assertPath(path);
    return !nps.isAbsolute(path) && !isRelative(path)
}

Resolve.isRelative = isRelative;
function isRelative (path) {
    assertPath(path);
    return path.trim().startsWith('.')
}

function assertPath(path) {
    if (typeof path !== 'string') {
        throw new TypeError('Path must be a string. Received ' + path);
    }
}

module.exports = Resolve
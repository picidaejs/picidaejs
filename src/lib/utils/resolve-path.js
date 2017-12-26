
const nps = require('path')
// const globalRequire = require('./createGlobalRequire')(__dirname)

function resolve(path, ...paths /*, paths*/) {
    assertPath(path);
    if (paths && paths.length) {
        path = path.replace(/\/*$/, '/') + nps.join.apply(nps, paths).replace(/^\/*/, '');
    }
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
    return !isAbsolute(path) && !isRelative(path)
}

Resolve.isRelative = isRelative;
function isRelative (path) {
    assertPath(path);
    return path.trim().startsWith('.')
}
Resolve.isRelative = isAbsolute;
function isAbsolute(path) {
    assertPath(path);
    return path.trim().startsWith('/')
}


function assertPath(path) {
    if (typeof path !== 'string') {
        throw new TypeError('Path must be a string. Received ' + path);
    }
}

module.exports = Resolve

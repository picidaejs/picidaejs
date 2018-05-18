'use strict';

var nps = require('path');
var os = require('os');
var isWin = os.platform() === 'win32';

// Pass the path 'C:\abc' -> 'C:\\abc'
// Needed in webpack code require
var escapeWinPath = function escapeWinPath(path) {
    return path.replace(/\\/g, '\\\\');
};

var toUriPath = isWin ? function (path) {
    return path.replace(/\\/g, '/');
} : function (path) {
    return path;
};

function resolve(path) /*, paths*/{
    assertPath(path);

    for (var _len = arguments.length, paths = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        paths[_key - 1] = arguments[_key];
    }

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
var Resolve = resolve;
Resolve.toUriPath = toUriPath;
Resolve.escapeWinPath = escapeWinPath;
Resolve.isNodeModule = isNodeModule;
function isNodeModule(path) {
    assertPath(path);
    return !isAbsolute(path) && !isRelative(path);
}

Resolve.isRelative = isRelative;
function isRelative(path) {
    assertPath(path);
    return path.trim().startsWith('.');
}
Resolve.isRelative = isAbsolute;
function isAbsolute(path) {
    assertPath(path);
    path = path.trim();
    return path.startsWith('/') || isWin && /^[a-z]:/i.test(path);
}

function assertPath(path) {
    if (typeof path !== 'string') {
        throw new TypeError('Path must be a string. Received ' + path);
    }
}

module.exports = Resolve;
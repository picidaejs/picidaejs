'use strict';

var loaderUtils = require('loader-utils');
var nps = require('path');
var resolve = require('./resolve-path');

function autoPrefix(path, prefix) {
    prefix = prefix.trim();
    path = path.trim();
    if (resolve.isNodeModule(path)) {
        path = !path.startsWith(prefix) ? prefix + path : path;
    }
    return path;
}

var parser = function parser(path) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var _opts$allowNotExists = opts.allowNotExists,
        allowNotExists = _opts$allowNotExists === undefined ? false : _opts$allowNotExists;

    var index = path.lastIndexOf('?');
    var opt = {};
    if (index >= 0) {
        opt = loaderUtils.parseQuery(path.substring(index));
        path = path.substring(0, index);
    }

    path = autoPrefix(path, prefix);
    try {
        path = resolve(path);
    } catch (ex) {
        if (allowNotExists) {
            return null;
        }
        throw ex;
    }
    return {
        opt: opt,
        path: path
    };
};

parser.injectJoin = function (target) {
    for (var _len = arguments.length, tails = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        tails[_key - 1] = arguments[_key];
    }

    var tail = nps.join.apply(null, tails);
    var index = target.lastIndexOf('?');
    if (index >= 0) {
        return target.substring(0, index).replace(/\/*$/, '/') + tail.replace(/^\/+/, '') + target.substring(index);
    }
    return target.replace(/\/*$/, '/') + tail.replace(/^\/+/, '');
};

// console.error(injectJoin('render-react?a=22', 'index.js'));

// console.log(parser(injectJoin('dom?a=22', 'index.js'), 'react-'))

parser.autoPrefix = autoPrefix;

module.exports = parser;
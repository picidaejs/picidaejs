'use strict';

/**
 * @file: globalRequire
 * @author: Cuttle Cong
 * @date: 2017/12/26
 * @description:
 */

var resolvePath = require('resolve');
var nps = require('path');

module.exports = function create() {
    var dirname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __dirname;


    function globalRequire(modulePath) {
        var path = globalRequire.resolve(modulePath);
        return require(path);
    }

    return Object.assign(globalRequire, require, {
        resolve: function resolve(modulePath) {
            // if (modulePath.trim().startsWith('.')) {
            //     modulePath = nps.join(dirname, modulePath)
            // }
            var path = void 0;
            try {
                path = require.resolve(modulePath);
            } catch (ex) {
                path = resolvePath.sync(modulePath, { basedir: process.cwd() });
            }
            return path;
        }
    });
};
'use strict';

/**
 * @file: find-parent-dir
 * @author: Cuttle Cong
 * @date: 2017/11/9
 * @description:
 */
var fs = require('./fs');
var nps = require('path');

function findParent(flag) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.cwd();
    var isFile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (!flag) return;

    var path = nps.join(start, flag);
    if (isFile ? fs.isFile(path) : fs.isDirectory(path)) {
        return start;
    }

    if (start === nps.resolve('/')) return;
    return findParent(flag, nps.dirname(start), isFile);
}

module.exports = findParent;
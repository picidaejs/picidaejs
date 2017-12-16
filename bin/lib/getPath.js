/**
 * @file: getPath
 * @author: Cuttle Cong
 * @date: 2017/11/9
 * @description: 
 */

var nps = require('path');
var fs = require('../../lib/lib/utils/fs');
var find = require('../../lib/lib/utils/find-parent-dir');
var console = require('../../lib/lib/utils/console').default;

module.exports = function (path) {
    var configPath, cwd = process.cwd()
    if (path) {
        configPath = nps.resolve(path)
        if(!fs.isFile(configPath)) {
            throw new Error('Not found `' + path + '`')
        } else {
            cwd = nps.dirname(configPath)
        }
    } else {
        cwd = find('picidae.config.js')
        if (!cwd) {
            throw new Error('Not found `picidae.config.js`')
        }
        configPath = nps.join(cwd, 'picidae.config.js')
    }

    console.log('config in:', configPath)

    return {
        configPath: configPath,
        cwd: cwd
    }
}
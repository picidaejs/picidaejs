'use strict';

var loaderUtils = require('loader-utils');
var boss = require('../common/boss');

var context = require('../../context');

module.exports = function mdLoader(content, sourceMap) {
    if (this.cachable) {
        this.cachable();
    }
    var _callback = this.async();

    var webpackRemainingChain = loaderUtils.getRemainingRequest(this).split('!');
    var filename = webpackRemainingChain[webpackRemainingChain.length - 1];
    // const options = loaderUtils.getOptions(this) || {}
    var _context$picidae = context.picidae,
        transformers = _context$picidae.nodeTransformers,
        filesMap = _context$picidae.docsEntry;

    var path = Object.keys(filesMap).find(function (path) {
        return filesMap[path] === filename;
    });

    boss.queue({
        content: content,
        path: path,
        filesMap: filesMap,
        transformers: transformers,
        filename: filename,
        callback: function callback(err, result) {
            _callback(err, ['/*markdown-loader*/', 'module.exports = ' + result].join('\n'));
        },

        type: 'markdown'
    });
};
'use strict';

var fs = require('fs');
var nps = require('path');
var utils = require('util');

var ruleMatch = require('./rule-match');

function filesToTree(root, file, filter) {
    if (!fs.existsSync(file)) throw new Error('Not found file: ' + file);
    var stat = fs.statSync(file);
    if (stat.isFile()) {
        if (ruleMatch(filter, file)) {
            return {
                type: 'file',
                file: file.substring(root.length).replace(/^\//, ''),
                lastmod: stat.mtime
            };
        }
    } else {
        var files = fs.readdirSync(file);
        files = files.map(function (f) {
            return filesToTree(file, nps.join(file, f), filter);
        }).filter(Boolean);

        return {
            type: 'dir',
            file: file.substring(root.length).replace(/^\//, ''),
            lastmod: stat.mtime,
            files: files
        };
    }
}

function file2Tree(root, filter) {
    root = nps.resolve(root);
    var tree = filesToTree(root, root, filter);
    if (!tree) return tree;
    tree.file = root;
    return tree;
}

module.exports = file2Tree;
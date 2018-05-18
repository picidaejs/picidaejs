'use strict';

var fs = require('fs');

fs.copySync = function (src, dest) {
    return fs.writeFileSync(dest, fs.readFileSync(src));
};

fs.isDirectory = function (path) {
    return fs.existsSync(path) && fs.statSync(path).isDirectory();
};
fs.isFile = function (path) {
    return fs.existsSync(path) && fs.statSync(path).isFile();
};

module.exports = fs;
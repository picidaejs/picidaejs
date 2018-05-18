'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.tmpPath = _path2.default.join(__dirname, '../tmp');
exports.templatePath = _path2.default.join(__dirname, '../templates');

exports.assign = function (data) {
    Object.assign(exports, data);
};
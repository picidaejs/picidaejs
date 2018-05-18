'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = build;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _getWebpackConfig = require('./getWebpackConfig');

var _getWebpackConfig2 = _interopRequireDefault(_getWebpackConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function build(config) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    var compiler = (0, _webpack2.default)(config, function (err, stats) {
        if (err !== null) {
            callback(err);
            return console.error(err);
        }

        if (stats.hasErrors()) {
            console.log(stats.toString('errors-only'));
            callback(stats.toString('errors-only'));
            return;
        }

        callback();
    });
}
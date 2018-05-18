'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = webpackConfigUpdater;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function preAppendEntry(entry, dev) {
    var preset = ['babel-polyfill', dev && 'react-hot-loader/patch', dev && 'webpack-hot-middleware/client?reload=true'].filter(Boolean);
    if (typeof entry === 'string') {
        entry = preset.concat(entry);
    } else if (Array.isArray(entry)) {
        entry = preset.concat.apply(preset, (0, _toConsumableArray3.default)(entry));
    } else {
        for (var k in entry) {
            entry[k] = preAppendEntry(entry[k], dev);
        }
    }
    return entry;
}

function webpackConfigUpdater() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var dev = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var _config$entry = config.entry,
        entry = _config$entry === undefined ? {} : _config$entry;


    entry = preAppendEntry(entry, dev);

    return (0, _extends3.default)({}, config, {
        entry: entry
    });
}
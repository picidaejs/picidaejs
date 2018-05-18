'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _warn = _chalk2.default.keyword('orange');
var _debug = _chalk2.default.keyword('pink');
var _error = _chalk2.default.bold.red;

exports.default = {
    log: function log() {
        var _console$log;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        (_console$log = console.log).call.apply(_console$log, [console, _chalk2.default.blue('Info :')].concat(args));
    },
    warn: function warn() {
        var _console$warn;

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        (_console$warn = console.warn).call.apply(_console$warn, [console, _warn('Warn :')].concat(args));
    },
    error: function error() {
        var _console$error;

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        (_console$error = console.error).call.apply(_console$error, [console, _error('Error!')].concat(args));
    },
    debug: function debug() {
        var _console$log2;

        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
        }

        (_console$log2 = console.log).call.apply(_console$log2, [console, _debug('@DEBUG')].concat(args));
    }
};
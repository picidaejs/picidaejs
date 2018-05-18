'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = externalExports;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file getExternalExports
 * @author Cuttle Cong
 * @date 2018/3/13
 * @description
 */

function externalExports(computedTransformers, transformers) {

    computedTransformers.forEach(function (_ref, i) {
        var opt = _ref.opt,
            path = _ref.path,
            index = _ref.index;

        var _require = require(path),
            _require$use = _require.use,
            use = _require$use === undefined ? [] : _require$use;

        if (typeof use === 'function') {
            use = use(opt || {});
        }
        if (!Array.isArray(use)) {
            use = [use];
        }
        use = use.filter(function (item) {
            return typeof item === 'string';
        });
        use = use.filter(function (u) {
            return !transformers.includes(u);
        });
        transformers.splice.apply(transformers, [index, 0].concat((0, _toConsumableArray3.default)(use)));
    });
}
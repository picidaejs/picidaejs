'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PicidaeError = function (_Error) {
    (0, _inherits3.default)(PicidaeError, _Error);

    function PicidaeError(message, id) {
        (0, _classCallCheck3.default)(this, PicidaeError);

        message = '[Picidae] ' + message;
        return (0, _possibleConstructorReturn3.default)(this, (PicidaeError.__proto__ || Object.getPrototypeOf(PicidaeError)).call(this, message, id));
    }

    return PicidaeError;
}(Error);

exports.default = PicidaeError;
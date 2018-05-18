'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = hoc;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _nprogress = require('nprogress');

var _nprogress2 = _interopRequireDefault(_nprogress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wrap(Component, extra) {
    return function (_React$Component) {
        (0, _inherits3.default)(HOC, _React$Component);

        function HOC() {
            (0, _classCallCheck3.default)(this, HOC);
            return (0, _possibleConstructorReturn3.default)(this, (HOC.__proto__ || Object.getPrototypeOf(HOC)).apply(this, arguments));
        }

        (0, _createClass3.default)(HOC, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                _nprogress2.default.done();
            }
        }, {
            key: 'render',
            value: function render() {
                var _props = this.props,
                    children = _props.children,
                    props = (0, _objectWithoutProperties3.default)(_props, ['children']);

                return _react2.default.createElement(
                    Component,
                    (0, _extends3.default)({}, extra, props),
                    children
                );
            }
        }]);
        return HOC;
    }(_react2.default.Component);
}

function inverseExtend(Component) {
    return function (_Component) {
        (0, _inherits3.default)(HOC, _Component);

        function HOC() {
            (0, _classCallCheck3.default)(this, HOC);
            return (0, _possibleConstructorReturn3.default)(this, (HOC.__proto__ || Object.getPrototypeOf(HOC)).apply(this, arguments));
        }

        (0, _createClass3.default)(HOC, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                (0, _get3.default)(HOC.prototype.__proto__ || Object.getPrototypeOf(HOC.prototype), 'componentDidMount', this) && (0, _get3.default)(HOC.prototype.__proto__ || Object.getPrototypeOf(HOC.prototype), 'componentDidMount', this).apply(this, args);
            }
        }]);
        return HOC;
    }(Component);
}

function hoc(data) {
    return function (Component) {
        return wrap(Component, data);
    };
}
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ssr;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _RouterContext = require('react-router/lib/RouterContext');

var _RouterContext2 = _interopRequireDefault(_RouterContext);

var _match = require('react-router/lib/match');

var _match2 = _interopRequireDefault(_match);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import createElement from './create-element'

function ssr(routes) {
    var isStatic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var basename = arguments[2];

    return function (url, callback) {
        (0, _match2.default)({ routes: routes, location: url, basename: basename }, function (error, redirectLocation, renderProps) {
            if (error) {
                callback('', renderProps);
            } else if (redirectLocation) {
                callback('', renderProps);
            } else if (renderProps) {
                var method = isStatic ? _server2.default.renderToStaticMarkup : _server2.default.renderToString;
                var content = method(_react2.default.createElement(_RouterContext2.default, renderProps)
                // createElement={createElement}
                );
                callback(content, renderProps);
            } else {
                callback('', null);
            }
        });
    };
}
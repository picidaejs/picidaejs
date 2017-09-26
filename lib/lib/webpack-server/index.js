'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var express = require('express');

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var defaultWebpackConfig = exports.defaultWebpackConfig = {};

var WPServer = function (_EventEmitter) {
    _inherits(WPServer, _EventEmitter);

    /**
     *
     * @param opt
     */
    function WPServer(opt) {
        _classCallCheck(this, WPServer);

        opt = _extends({}, opt, WPServer.defaultOptions);

        var _this = _possibleConstructorReturn(this, (WPServer.__proto__ || Object.getPrototypeOf(WPServer)).call(this, opt));

        _this.opt = opt;
        return _this;
    }

    _createClass(WPServer, [{
        key: 'start',
        value: function start() {}
    }]);

    return WPServer;
}(EventEmitter);

WPServer.defaultOptions = {
    port: 8989,
    webpackConfigGetter: function webpackConfigGetter(config) {
        return config;
    } };
exports.default = WPServer;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = renderUtil;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HtmlToReact = require('html-to-react');
var camelAttributeNames = require('html-to-react/lib/camel-case-attribute-names');
var utils = require('html-to-react/lib/utils');
var Parser = HtmlToReact.Parser;

var processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(_react2.default);
var htmlToReactParser = new Parser();

var processingInstructions = [{
    replaceChildren: false,
    shouldProcessNode: function shouldProcessNode(node) {
        var href = node.attribs && node.attribs['href'];
        return node.name === 'a' && href != null && !href.startsWith('#') && !/^(http:|https:|ftp:)\/\//.test(href.trim());
    },
    processNode: function processNode(node, children, index) {
        node.name = _reactRouter.Link;
        node.attribs['to'] = node.attribs['href'];
        delete node.attribs['href'];
        return utils.createElement(node, index, node.data, children);
    }
}, {
    shouldProcessNode: function shouldProcessNode(node) {
        return true;
    },
    processNode: processNodeDefinitions.processDefaultNode
}];

var isValidNode = function isValidNode() {
    return true;
};

var MarkdownRoot = function (_React$Component) {
    (0, _inherits3.default)(MarkdownRoot, _React$Component);

    function MarkdownRoot() {
        (0, _classCallCheck3.default)(this, MarkdownRoot);
        return (0, _possibleConstructorReturn3.default)(this, (MarkdownRoot.__proto__ || Object.getPrototypeOf(MarkdownRoot)).apply(this, arguments));
    }

    (0, _createClass3.default)(MarkdownRoot, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _props$callbackCollec = this.props.callbackCollection,
                callbackCollection = _props$callbackCollec === undefined ? [] : _props$callbackCollec;


            var dom = _reactDom2.default.findDOMNode(this);
            callbackCollection.forEach(function (callback) {
                return callback(dom);
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var _this2 = this;

            var _props$unmountCollect = this.props.unmountCollection,
                unmountCollection = _props$unmountCollect === undefined ? [] : _props$unmountCollect;

            unmountCollection.forEach(function (callable) {
                return callable(_this2.props);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                pageData = _props.pageData,
                convertRules = _props.convertRules;

            if (!pageData || !pageData.markdown) {
                return null;
            }

            var comp = htmlToReactParser.parseWithInstructions(pageData.markdown.content, isValidNode, convertRules.concat(processingInstructions));

            return _react2.default.createElement(
                'article',
                null,
                comp
            );
        }
    }]);
    return MarkdownRoot;
}(_react2.default.Component);

function renderUtil(pageData) {
    var transformers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var collection = [];
    var unmountCollection = [];
    function callbackCollect(callback) {
        if (typeof callback === 'function') {
            collection.push(callback);
        }
    }
    function unmountCallbackCollect(callback) {
        if (typeof callback === 'function') {
            unmountCollection.push(callback);
        }
    }

    var convertRules = transformers.reduce(function (convertRules, transformer) {
        var ret = transformer.call({ callbackCollect: callbackCollect, unmountCallbackCollect: unmountCallbackCollect }, pageData);
        if ((typeof ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(ret)) === 'object') {
            convertRules = convertRules.concat(ret);
        }
        return convertRules;
    }, []);

    return _react2.default.createElement(MarkdownRoot, { convertRules: convertRules, unmountCollection: unmountCollection, callbackCollection: collection, pageData: pageData });
}
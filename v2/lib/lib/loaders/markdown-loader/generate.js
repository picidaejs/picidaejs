'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.alignClass = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _remark = require('remark');

var _remark2 = _interopRequireDefault(_remark);

var _remarkAlign = require('remark-align');

var _remarkAlign2 = _interopRequireDefault(_remarkAlign);

var _remarkGemojiToEmoji = require('remark-gemoji-to-emoji');

var _remarkGemojiToEmoji2 = _interopRequireDefault(_remarkGemojiToEmoji);

var _remarkSlug = require('remark-slug');

var _remarkSlug2 = _interopRequireDefault(_remarkSlug);

var _remarkHighlight = require('remark-highlight.js');

var _remarkHighlight2 = _interopRequireDefault(_remarkHighlight);

var _loadFront = require('../../utils/loadFront');

var _loadFront2 = _interopRequireDefault(_loadFront);

var _remarkAutolinkHeadings = require('remark-autolink-headings');

var _remarkAutolinkHeadings2 = _interopRequireDefault(_remarkAutolinkHeadings);

var _remarkRehype = require('remark-rehype');

var _remarkRehype2 = _interopRequireDefault(_remarkRehype);

var _rehypeRaw = require('rehype-raw');

var _rehypeRaw2 = _interopRequireDefault(_rehypeRaw);

var _safePresetMinify = require('./safe-preset-minify');

var _safePresetMinify2 = _interopRequireDefault(_safePresetMinify);

var _rehypeStringify = require('rehype-stringify');

var _rehypeStringify2 = _interopRequireDefault(_rehypeStringify);

var _unistUtilVisit = require('unist-util-visit');

var _unistUtilVisit2 = _interopRequireDefault(_unistUtilVisit);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var alignClass = exports.alignClass = {
    left: 'align-left',
    center: 'align-center',
    right: 'align-right'
};

function generate(content, info, callback) {
    var remarkTransformers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var rehypeTransformers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    var _yamlFront$loadFront = _loadFront2.default.loadFront(content),
        __content = _yamlFront$loadFront.__content,
        meta = (0, _objectWithoutProperties3.default)(_yamlFront$loadFront, ['__content']);

    toHTML(__content, info, remarkTransformers, rehypeTransformers).then(function (data) {
        return callback(null, meta, data);
    }).catch(function (err) {
        return callback(err);
    });
}

generate.toHTML = toHTML;

function toHTML(md) {
    var info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var remarkTransformers = arguments[2];
    var rehypeTransformers = arguments[3];

    var extra = {};

    function middleForThis() {
        this.picidae = function () {
            return {
                info: info,
                inject: function inject(key, value) {
                    extra[key] = value;
                }
            };
        };

        return function (node) {
            (0, _unistUtilVisit2.default)(node, 'code', function (codeNode) {
                var lang = codeNode.lang || '';

                var i = lang.lastIndexOf('?');
                var query = {};
                if (i >= 0) {
                    query = _loaderUtils2.default.parseQuery(lang.substr(i));
                    lang = lang.substring(0, i);
                }
                codeNode.lang = lang;
                codeNode.data = codeNode.data || {};
                codeNode.data.hProperties = codeNode.data.hProperties || {};
                codeNode.data.hProperties['data-query'] = JSON.stringify(query);
                codeNode.data.hProperties['data-lang'] = lang;
            });
        };
    }

    _remarkAlign2.default.options = alignClass;
    var presetTransformers = [_remarkGemojiToEmoji2.default, _remarkAlign2.default, _remarkSlug2.default, _remarkAutolinkHeadings2.default, middleForThis];
    _remarkRehype2.default.options = { allowDangerousHTML: true };
    var appended = [_remarkRehype2.default, _rehypeRaw2.default].concat(rehypeTransformers).concat([_safePresetMinify2.default, _rehypeStringify2.default]);
    var source = (0, _remark2.default)();
    var transformers = presetTransformers.concat(remarkTransformers, _remarkHighlight2.default, appended);
    return new Promise(function (resolve, reject) {
        source = transformers.reduce(function (source, transformer) {
            return source.use(transformer, transformer.options || {});
        }, source);
        source.process(md, function (err, file) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    content: file.contents,
                    extra: extra
                });
            }
        });
    });
}

module.exports = generate;
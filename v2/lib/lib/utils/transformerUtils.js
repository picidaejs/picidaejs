'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.chain = function () {
    var transformers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var beginData = arguments[1];
    var extra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return transformers.reduce(function (promise, transformer) {
        return promise.then(function (data) {
            return transformer((0, _extends3.default)({ data: data }, extra), require);
        });
    }, Promise.resolve(beginData));
};

exports.split = function () {
    var transformers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var remarkTransformers = [];
    var rehypeTransformers = [];
    var markdownTransformers = [];
    var htmlTransformers = [];
    transformers.forEach(function (_ref) {
        var path = _ref.path,
            opt = _ref.opt;

        var transformer = require(path);
        if (typeof transformer.remarkTransformer === 'function') {
            transformer.remarkTransformer.options = opt;
            remarkTransformers.push(transformer.remarkTransformer);
        }
        if (typeof transformer.rehypeTransformer === 'function') {
            transformer.rehypeTransformer.options = opt;
            rehypeTransformers.push(transformer.rehypeTransformer);
        }
        if (typeof transformer.markdownTransformer === 'function') {
            markdownTransformers.push(transformer.markdownTransformer.bind(null, opt));
        }
        if (typeof transformer.htmlTransformer === 'function') {
            htmlTransformers.push(transformer.htmlTransformer.bind(null, opt));
        }
        if (typeof transformer === 'function') {
            transformer.options = opt;
            remarkTransformers.push(transformer);
        }
    });

    return { htmlTransformers: htmlTransformers, rehypeTransformers: rehypeTransformers, markdownTransformers: markdownTransformers, remarkTransformers: remarkTransformers };
};
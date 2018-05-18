'use strict';

var _utils = require('html-to-react/lib/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (opt) {
    return function (pageData) {
        var array = pageData.markdown.extra['_image-loader_'] || [];

        return [{
            replaceChildren: false,
            shouldProcessNode: function shouldProcessNode(node) {
                return node.name === 'img' && 'data-image-loader' in node.attribs && !isNaN(node.attribs['data-image-loader']);
            },
            processNode: function processNode(node) {
                var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
                var index = arguments[2];

                var i = parseInt(node.attribs['data-image-loader']);
                node.attribs['src'] = array[i];
                global.__picidae__emitter.emit('after-img-loader-replace-src', node, children);
                // pageData
                return _utils2.default.createElement(node, index, node.data, children);
            }
        }];
    };
}; /**
    * @file browser
    * @author Cuttle Cong
    * @date 2018/3/14
    * @description
    */
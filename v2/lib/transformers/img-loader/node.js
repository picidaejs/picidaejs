'use strict';

var _unistUtilVisit = require('unist-util-visit');

var _unistUtilVisit2 = _interopRequireDefault(_unistUtilVisit);

var _fs = require('../../lib/utils/fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file node
 * @author Cuttle Cong
 * @date 2018/3/14
 * @description
 */
function isUrlString(str) {
    return _url2.default.parse(str).slashes || str.startsWith('//');
}

exports.rehypeTransformer = function rehypeTransformer(option) {
    var _picidae = this.picidae(),
        _picidae$info = _picidae.info,
        path = _picidae$info.path,
        filesMap = _picidae$info.filesMap,
        meta = _picidae$info.meta,
        inject = _picidae.inject;

    var array = [];
    var index = 0;
    inject('_image-loader_', array);
    var filename = filesMap[path];
    var dirname = _path2.default.dirname(filename);
    // console.log(filename)
    return function process(node) {
        (0, _unistUtilVisit2.default)(node, 'element', function (node) {
            if (node.tagName !== 'img') {
                return;
            }
            var properties = node.properties;
            if (properties.src && !isUrlString(properties.src)) {
                var imgFilePath = _path2.default.resolve(dirname, properties.src);
                if (_fs2.default.isFile(imgFilePath)) {
                    properties['data-image-loader'] = index++;
                    array.push({
                        PICIDAE_EVAL_CODE: true,
                        value: 'require(' + JSON.stringify(imgFilePath) + ')'
                    });
                }
            }
        });
    };
};
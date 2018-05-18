'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var generatePickedMeta = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(filesMap, _ref3) {
    var _this = this;

    var picker = _ref3.picker,
        _ref3$fromPath = _ref3.fromPath,
        fromPath = _ref3$fromPath === undefined ? process.cwd() : _ref3$fromPath,
        _ref3$htmlTransformer = _ref3.htmlTransformers,
        htmlTransformers = _ref3$htmlTransformer === undefined ? [] : _ref3$htmlTransformer,
        _ref3$markdownTransfo = _ref3.markdownTransformers,
        markdownTransformers = _ref3$markdownTransfo === undefined ? [] : _ref3$markdownTransfo,
        _ref3$docsEntityEntry = _ref3.docsEntityEntry,
        docsEntityEntry = _ref3$docsEntityEntry === undefined ? {} : _ref3$docsEntityEntry,
        _ref3$remarkTransform = _ref3.remarkTransformers,
        remarkTransformers = _ref3$remarkTransform === undefined ? [] : _ref3$remarkTransform,
        _ref3$rehypeTransform = _ref3.rehypeTransformers,
        rehypeTransformers = _ref3$rehypeTransform === undefined ? [] : _ref3$rehypeTransform;

    var picked, publicPath, _loop, path;

    return _regenerator2.default.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            picker = picker || function (meta) {
              return meta;
            };

            picked = {};
            publicPath = context.picidae.opts.publicPath;
            _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop(path) {
              var meta, content, filename, infoData, getMarkdownData;
              return _regenerator2.default.wrap(function _loop$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      getMarkdownData = function getMarkdownData() {
                        var md = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : content;

                        return new Promise(function (resolve, reject) {
                          generate(md, infoData, function (err, meta, data) {
                            if (err) {
                              reject(err);
                            } else {
                              resolve(chain(htmlTransformers, data, {
                                meta: (0, _extends3.default)({}, meta),
                                path: path,
                                filesMap: (0, _extends3.default)({}, filesMap)
                              })
                              // .then(data => stringify(data))
                              );
                            }
                          }, remarkTransformers, rehypeTransformers);
                        });
                      };

                      meta = yamlFront.loadFront(fs.readFileSync(filesMap[path]).toString());
                      content = meta.__content;

                      delete meta.__content;
                      if (docsEntityEntry[path]) {
                        docsEntityEntry[path] = (0, _extends3.default)({
                          meta: (0, _extends3.default)({}, meta),
                          content: content
                        }, docsEntityEntry[path]);
                      }
                      filename = filesMap[path];
                      infoData = { meta: (0, _extends3.default)({}, meta), path: path, filesMap: (0, _extends3.default)({}, filesMap) };
                      _context.next = 9;
                      return chain(markdownTransformers, content, infoData);

                    case 9:
                      content = _context.sent;


                      meta.datetime = moment(meta.datetime || fs.statSync(filename).mtime).format();
                      meta.filename = meta.filename || nps.relative(fromPath, filename);
                      _context.next = 14;
                      return picker(meta, { content: content, filename: filename, getMarkdownData: getMarkdownData, path: path }, require);

                    case 14:
                      meta = _context.sent;

                      if (meta) {
                        picked[path] = meta;
                      }

                    case 16:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _loop, _this);
            });
            _context2.t0 = _regenerator2.default.keys(filesMap);

          case 5:
            if ((_context2.t1 = _context2.t0()).done) {
              _context2.next = 10;
              break;
            }

            path = _context2.t1.value;
            return _context2.delegateYield(_loop(path), 't2', 8);

          case 8:
            _context2.next = 5;
            break;

          case 10:
            return _context2.abrupt('return', picked);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee, this);
  }));

  return function generatePickedMeta(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var summaryGenerate = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(filesMap, _ref6) {
    var _ref6$plugins = _ref6.plugins,
        plugins = _ref6$plugins === undefined ? [] : _ref6$plugins,
        docsEntityEntry = _ref6.docsEntityEntry,
        nodeTransformers = _ref6.nodeTransformers,
        _ref6$transformers = _ref6.transformers,
        transformers = _ref6$transformers === undefined ? [] : _ref6$transformers,
        picker = _ref6.picker,
        docRoot = _ref6.docRoot;
    var lazyload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var _split, markdownTransformers, htmlTransformers, remarkTransformers, rehypeTransformers, meta;

    return _regenerator2.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _split = split(nodeTransformers), markdownTransformers = _split.markdownTransformers, htmlTransformers = _split.htmlTransformers, remarkTransformers = _split.remarkTransformers, rehypeTransformers = _split.rehypeTransformers;
            _context3.next = 3;
            return generatePickedMeta(filesMap, {
              docsEntityEntry: docsEntityEntry,
              picker: picker,
              fromPath: docRoot,
              markdownTransformers: markdownTransformers,
              htmlTransformers: htmlTransformers,
              remarkTransformers: remarkTransformers,
              rehypeTransformers: rehypeTransformers
            });

          case 3:
            meta = _context3.sent;
            return _context3.abrupt('return', Promise.resolve('{' + '\n  lazyload: {' + generateLazyLoad(filesMap, lazyload) + '  },' + '\n  meta: ' + stringify(meta, null, 2) + '\n,' + '\n  plugins: [' + pluginsStr(plugins) + '],' + '\n  transformers: [' + pluginsStr(transformers) + ']' + '\n};'));

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee2, this);
  }));

  return function summaryGenerate(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generate Meta / LazyLoad Data For Webpack
 */

var yamlFront = require('../../utils/loadFront');
var fs = require('fs');
var nps = require('path');
var moment = require('moment');

var generate = require('../markdown-loader/generate');
var context = require('../../context');

var _require = require('../../utils/transformerUtils'),
    chain = _require.chain,
    split = _require.split;

var stringify = require('../../utils/stringify');

var _require2 = require('../../utils/resolve-path'),
    escapeWinPath = _require2.escapeWinPath,
    toUriPath = _require2.toUriPath;

var mdLoaderPath = require.resolve('../markdown-loader');

/**
 * @param filesMap
 *   posts/a.md: 'absolute path'
 */
function generateLazyLoad(filesMap, lazy) {
  function tpl(_ref) {
    var require = _ref.require,
        name = _ref.name;

    return lazy ? '\n    ' + JSON.stringify(name) + ': function () {\n        return new Promise(function (resolve) {\n            require.ensure([], function (require) {\n                resolve(require(' + JSON.stringify('!!' + toUriPath(mdLoaderPath) + '!' + toUriPath(require)) + '));\n            }, ' + JSON.stringify(name) + ')\n        })\n    },' : '\n    ' + JSON.stringify(name) + ': function() {\n        return new Promise(function (resolve) {\n            resolve(require(' + JSON.stringify('!!' + toUriPath(mdLoaderPath) + '!' + toUriPath(require)) + '));\n        })    \n    },';
  }

  var lazyload = '';
  for (var path in filesMap) {
    lazyload += tpl({ require: filesMap[path], name: path }) + '\n';
  }

  return lazyload;
}

function pluginsStr() {
  var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return plugins.map(function (_ref4) {
    var path = _ref4.path,
        opt = _ref4.opt;
    return '(require(\'' + toUriPath(path) + '\').default || require(\'' + toUriPath(path) + '\'))(' + JSON.stringify(opt) + ')';
  }).join(',');
}

module.exports = summaryGenerate;
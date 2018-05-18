'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var over = require('../../utils/overwrite-require');
var marked = require('../markdown-loader/generate');

var _require = require('../../utils/transformerUtils'),
    chain = _require.chain,
    split = _require.split;

var stringify = require('../../utils/stringify');
var YFM = require('../../utils/loadFront');
var u = require('url');
var console = require('../../utils/console').default;

// Child Process
over.register();

process.on('uncaughtException', console.error);

process.on('message', function (task) {
    var filename = task.filename,
        _task$filesMap = task.filesMap,
        filesMap = _task$filesMap === undefined ? {} : _task$filesMap,
        path = task.path,
        content = task.content,
        plugins = task.plugins,
        transformers = task.transformers,
        type = task.type,
        args = task.args;


    if (type === 'markdown') {
        var _split = split(transformers),
            markdownTransformers = _split.markdownTransformers,
            htmlTransformers = _split.htmlTransformers,
            remarkTransformers = _split.remarkTransformers,
            rehypeTransformers = _split.rehypeTransformers;

        var _YFM$loadFront = YFM.loadFront(content),
            __content = _YFM$loadFront.__content,
            meta = (0, _objectWithoutProperties3.default)(_YFM$loadFront, ['__content']);

        var infoData = { meta: (0, _extends3.default)({}, meta), filesMap: (0, _extends3.default)({}, filesMap), path: path };
        var promise = chain(markdownTransformers, content, infoData);

        promise.then(function (md) {
            return new Promise(function (resolve) {
                marked(md, infoData, function (err, _meta, data) {
                    if (err) {
                        console.error(err);
                        process.send(JSON.stringify(data, null, 2));
                        return;
                    }
                    resolve({ meta: _meta, data: data });
                }, remarkTransformers, rehypeTransformers);
            });
        }).then(function (_ref) {
            var meta = _ref.meta,
                data = _ref.data;

            return chain(htmlTransformers, data, { meta: (0, _extends3.default)({}, meta), filesMap: (0, _extends3.default)({}, filesMap), path: path });
        }).then(function (data) {
            process.send(stringify(data, null, 2));
        }).catch(function (err) {
            console.error(err);
            process.send(stringify({}, null, 2));
        });
    }
    // else if (type === 'summary') {
    //     if (args[1] && args[1].picker) {
    //         eval('args[1].picker = ' + args[1].picker);
    //     }
    //     data = summary.apply(null, args);
    //     process.send(data);
    // }
    else if (type === 'renderHtml') {
            var write = function write(path) {
                fs.writeFile(path, htmlString, function (err) {
                    if (err) {
                        process.send('');
                    } else {
                        process.send({
                            path: path,
                            hrefList: hrefList
                        });
                    }
                });
            };

            var fs = require('fs');

            var _require2 = require('mkdirp'),
                sync = _require2.sync;

            var nps = require('path');

            var tpl = args[0];
            var ctx = args[1];
            var opt = args[2] || {};
            var _path = opt.path,
                spider = opt.spider,
                _opt$pathname = opt.pathname,
                pathname = _opt$pathname === undefined ? '' : _opt$pathname;


            var htmlString = require('nunjucks').renderString(tpl, ctx);
            var hrefList = [];

            if (spider) {
                var $ = require('cheerio').load(htmlString);
                var links = $('a');
                links.map(function () {
                    var href = $(this).attr('href') || '';
                    href = href.trim();
                    if (href && !href.startsWith('#')) {
                        href = require('url').resolve(pathname, href).trim();
                        if (!/^(\/\/|https?:|ftp:|file:|javascript:|mailto:)/.test(href)) {
                            hrefList.push(u.parse(href).pathname);
                        }
                    }
                });
            }

            write(_path);
        }
});
'use strict';

/**
 * @file: write-html
 * @author: cong
 */

var fs = require('fs');

var _require = require('mkdirp'),
    sync = _require.sync;

var nps = require('path');
var nunjucks = require('nunjucks');
var cheerio = require('cheerio');

module.exports = function (tpl, ctx) {
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var path = opt.path,
        spider = opt.spider,
        _opt$pathname = opt.pathname,
        pathname = _opt$pathname === undefined ? '' : _opt$pathname;


    var htmlString = nunjucks.renderString(tpl, ctx);
    var hrefList = [];

    if (spider) {
        var $ = cheerio.load(htmlString);
        var links = $('a');
        links.map(function () {
            var href = $(this).attr('href') || '';
            href = href.trim();
            if (href && !href.startsWith('#')) {
                href = require('url').resolve(pathname, href).trim();
                if (!/^(\/\/|https?:|ftp:|file:)/.test(href)) {
                    hrefList.push(href);
                }
            }
        });
    }

    function writep(path) {
        return new Promise(function (resolve) {
            fs.writeFileSync(path, htmlString);
            resolve({
                path: path,
                hrefList: hrefList
            });
            // fs.writeFile(path, htmlString, (err) => {
            //     if (err) {
            //         resolve('');
            //     }
            //     else {
            //         resolve({
            //             path,
            //             hrefList
            //         });
            //     }
            // })
        });
    }
    return writep(path);
};
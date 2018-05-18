'use strict';

/**
 * @file: to-sitemap
 * @author: Cuttle Cong
 * @date: 2017/10/29
 */

var url = require('url');
var html_encode = require('./html-encode');

function toSitemap(_ref) {
    var _ref$host = _ref.host,
        host = _ref$host === undefined ? '' : _ref$host,
        _ref$sites = _ref.sites,
        sites = _ref$sites === undefined ? [] : _ref$sites,
        _ref$minify = _ref.minify,
        minify = _ref$minify === undefined ? true : _ref$minify;

    host = host.replace(/\/*$/, '/');
    var sep = minify ? '' : '\n';

    var content = sites.map(function (loc) {
        var str = '';
        if (typeof loc === 'string') {
            str += '<loc>' + html_encode(url.resolve(host, loc)) + '</loc>';
        } else {
            str += '<loc>' + html_encode(url.resolve(host, loc.loc)) + '</loc>';
            str += '<lastmod>' + new Date(loc.lastmod).toISOString() + '</lastmod>';
        }
        return '<url>' + str + '</url>';
    }).join(sep);

    return ['<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">', content, '</urlset>'].join(sep);
}

function toRobots(host) {

    return ['User-agent: *', 'Sitemap: ' + html_encode(url.resolve(host, 'sitemap.xml'))].join('\n');
}

exports.toSitemap = toSitemap;
exports.toRobots = toRobots;
'use strict';

var nps = require('path');

var sitmapGenerator = function sitmapGenerator(route) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (!route) {
        return [];
    }
    var routes = [];
    if (!Array.isArray(route)) {

        var path = root.replace(/\/*$/, '') + (route.path || '').replace(/^\/*/, '/');
        if (route.component || route.getComponent) {
            routes.push(path.replace(/^\/*/, '/'));
        }

        if (route.indexRoute) {
            routes.push(path.replace(/\/*$/, '') + (route.indexRoute.path || '').replace(/^\/*/, '/'));
        }
        if (route.childRoutes) {
            routes = routes.concat(sitmapGenerator(route.childRoutes, path));
        }
        return routes;
    }

    routes = route.reduce(function (routes, x) {
        return routes.concat(sitmapGenerator(x, root));
    }, routes);

    return routes;
};

function wrap(route) {
    var filesEntry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var sites = sitmapGenerator(route);
    if (!sites.includes('/')) {
        sites.push('/');
    }
    var ret = [];
    var map = {};

    sites = sites.filter(function (x) {
        return !x.includes('*') && !x.includes(':');
    }).concat(Object.keys(filesEntry).map(function (path) {
        return '/' + path.replace(/^\/+/, '');
    }));

    sites.forEach(function (x) {
        if (map[x]) {} else {
            ret.push(x);
            map[x] = true;
        }
    });

    return ret.map(transform).concat({
        path: 'NOT_FOUND_PAGE',
        html: '/404.html'
    });
}

function transformHexo(path) {
    var html = '';
    path = path.trim();
    if (path === '/') {
        html = '/index.html';
    } else {
        if (!/\.html?$/i.test(path)) {
            html = nps.join(path, 'index.html');
        } else if (!/\/index.html?$/i.test(path) && !/^index.html?$/i.test(path)) {
            html = path.replace(/\.html?$/i, '') + '.html';
        } else {
            html = path;
        }
    }

    return { path: path, html: html };
}

function transform(path) {
    var html = '';

    if (path === '/index') {
        html = '/index.html';
        path = '/';
    } else if (!path.endsWith('/')) {
        html = path.replace(/\.html?$/, '') + '.html';
    } else {
        html = path + 'index.html';
    }

    return { path: decodeURIComponent(path), html: decodeURIComponent(html) };
}

wrap.transform = transform;
module.exports = wrap;
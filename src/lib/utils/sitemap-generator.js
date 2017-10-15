const nps = require('path')

const sitmapGenerator = function (route, root = '') {
    if (!route) {
        return []
    }
    let routes = [];
    if (!Array.isArray(route)) {

        let path = root + (route.path || '');
        if (route.component || route.getComponent) {
            routes.push(path)
        }

        if (route.indexRoute) {
            routes.push(path + (route.indexRoute.path || ''))
        }
        if (route.childRoutes) {
            routes = routes.concat(sitmapGenerator(route.childRoutes, path))
        }
        return routes;
    }

    routes = route.reduce((routes, x) => {
        return routes.concat(sitmapGenerator(x, root))
    }, routes);

    return routes
}


function wrap(route, filesEntry = {}) {
    let sites = sitmapGenerator(route)
    let ret = [];
    let map = {};

    sites = sites
        .filter(x => !x.includes('*') && !x.includes(':'))
        .concat(Object.keys(filesEntry).map(path => '/' + path.replace(/^\/+/, '')))

    sites.forEach(x => {
        if (map[x]) {}
        else {
            ret.push(x);
            map[x] = true
        }
    });

    return ret
        .map(transform)
        .concat({
            path: 'NOT_FOUND_PAGE',
            html: '/404.html'
        })

}

function transformHexo(path) {
    let html = '';
    path = path.trim();
    if (path === '/') {
        html = '/index.html'
    }
    else {
        if (!/\.html?$/i.test(path)) {
            html = nps.join(path, 'index.html');
        }
        else if (!/\/index.html?$/i.test(path) && !/^index.html?$/i.test(path)) {
            html = path.replace(/\.html?$/i, '') + '.html';
        }
        else {
            html = path;
        }
    }

    return {path, html}
}

function transform(path) {
    let html = '';

    if (path === '/INDEX') {
        html = '/index.html';
        path = '/';
    }
    else if (!path.endsWith('/')) {
        html = path.replace(/\.html?$/, '') + '.html'
    } else {
        html = path + 'index.html'
    }

    return {path: decodeURIComponent(path), html: decodeURIComponent(html)}
}

wrap.transform = transform
module.exports = wrap;
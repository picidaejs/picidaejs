

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

    sites.forEach(x => {
        if (map[x]) {}
        else {
            ret.push(x);
            map[x] = true
        }
    });

    function transform(path) {
        let html = '';
        if (path === '/') {
            html = '/index.html'
        }
        else {
            html = path.replace(/\.html?$/, '') + '.html'
        }

        return {path, html}
    }

    return ret
        .filter(x => !x.includes('*') && !x.includes(':'))
        .concat(Object.keys(filesEntry).map(path => '/' + path.replace(/^\/+/, '')))
        .map(transform)
        .concat({
            path: 'NOT_FOUND_PAGE',
            html: '/404.html'
        })
}

module.exports = wrap;
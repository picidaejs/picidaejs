import {join, basename} from 'path'
import Error from './Error'
import NProgress from 'nprogress'

if (typeof require.ensure !== 'function') {
    require.ensure = (dependencies, callback) => {
        return callback(require)
    }

    require('babel-core/register')
}

function wrapGetComponent(template, path) {
    const Comp = require(template).default || require(template);

    return function getComponent(nextState, callback) {
        require.ensure([], require =>
            callback(null, Comp),
            basename(template)
        )
    }
}
export default function routesGenerator({routes, root, notFound}) {
    if (!routes) {
        throw new Error('routes CAN\'T BE NULL.')
    }

    if (!Array.isArray(routes)) {
        routes = [routes]
    }

    function processRoutes(routes) {
        if (Array.isArray(routes)) {
            return routes.map(processRoutes)
        }

        return {
            ...routes,
            onEnter() {
                if (typeof document !== 'undefined') {
                    NProgress.start();
                }
            },
            component: require(join(root, routes.component)).default,//void 0,
            // getComponent: wrapGetComponent(join(root, routes.component), routes.dataPath || routes.path),
            indexRoute: routes.indexRoute && {
                ...routes.indexRoute,
                component: void 0,
                getComponent: wrapGetComponent(join(root, routes.indexRoute.component), routes.indexRoute.dataPath || routes.indexRoute.path)
            },
            childRoutes: routes.childRoutes && routes.childRoutes.map(processRoutes)
        }
    }


    let customizedRoutes = routes.map(processRoutes);
    customizedRoutes.push({
        path: '*',
        getComponent: wrapGetComponent(notFound ? join(root, notFound) : '../template/NotFound')
    })

    return customizedRoutes;
}
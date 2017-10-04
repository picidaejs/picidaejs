import {join, basename} from 'path'
import Error from '../utils/Error'
import NProgress from 'nprogress'

if (typeof require.ensure !== 'function') {
    require.ensure = (dependencies, callback) => {
        return callback(require)
    }

    require('babel-core/register')
}

function wrapGetComponent(template, opt = {}) {
    let Comp = require('{{root}}/' + template.replace(/^[\/\.]+/, ''))
    Comp = Comp.default || Comp;

    return function getComponent(nextState, callback) {
        callback(null, Comp)
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
            component: void 0,
            getComponent: wrapGetComponent(routes.component, routes.dataPath || routes.path),
            indexRoute: routes.indexRoute && {
                ...routes.indexRoute,
                component: void 0,
                getComponent: wrapGetComponent(routes.indexRoute.component, routes.indexRoute.dataPath || routes.indexRoute.path)
            },
            childRoutes: routes.childRoutes && routes.childRoutes.map(processRoutes)
        }
    }


    let customizedRoutes = routes.map(processRoutes);
    customizedRoutes.push({
        path: '*',
        getComponent: wrapGetComponent(notFound)
    })

    return customizedRoutes;
}
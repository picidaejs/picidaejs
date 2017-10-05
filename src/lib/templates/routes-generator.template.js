import {join, basename} from 'path'
import Error from '../utils/Error'
import hoc from '../utils/hoc'
import data from './data'

import NProgress from 'nprogress'

if (typeof require.ensure !== 'function') {
    require.ensure = (dependencies, callback) => {
        return callback(require)
    }

    require('babel-core/register')
}


export default function routesGenerator({routes, root, notFound, themeConfig}) {

    function wrapGetComponent(template, path) {
        let Comp = require('{{root}}/' + template.replace(/^[\/\.]+/, ''))

        return function getComponent(nextState, callback) {
            Comp = hoc({
                pageData: data,
                themeConfig,
                nextState
            })(Comp.default || Comp);

            callback(null, Comp)
        }
    }


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
        onEnter() {
            if (typeof document !== 'undefined') {
                NProgress.start();
            }
        },
        getComponent: wrapGetComponent(notFound)
    })

    return customizedRoutes;
}
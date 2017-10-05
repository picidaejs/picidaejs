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

function wrapData(data) {
    let lazy = data.lazyload;
    let meta = data.meta;

    for (let path in lazy) {
        lazy[path] = (function (callable, path) {
            return function () {
                return callable().then(markdown => {
                    return {
                        markdown,
                        meta: meta[path]
                    }
                });
            }
        })(lazy[path], path)
    }
}

let map = JSON.parse('{{ routesMap | safe }}');
Object.keys(map).forEach(key => {
    map[key.replace(/^\/+/, '').replace(/\/+$/, '')] = map[key]
})

function replacePathname(pathname) {
    let matched = false
    return pathname
        .split('/')
        .map((chunk) => {
            if (!matched) {
                if (map[chunk]) {
                    matched = true;
                }
                return map[chunk] || chunk;
            }
            else {
                return chunk;
            }
        })
        .join('/')
}

async function defaultCollector(next) {
    return next;
}

export default function routesGenerator({routes, root, notFound, themeConfig}) {

    wrapData(data);

    function getComp(template) {
        if (typeof template === 'string') {
            let Comp = require('{{root}}/' + template.replace(/^[\/\.]+/, ''))
            return Comp.default || Comp;
        }
        return template
    }

    function wrapGetComponent(template, path) {

        return function getComponent(nextState, callback) {
            let Component = getComp(template);

            let pathname = nextState.location.pathname
                        .replace(/^\/+/, '')
                        .replace(/\/+$/, '')
            pathname = replacePathname(pathname);

            let nextProps = {
                ...nextState,
                data,
                pageData: data.lazyload[pathname],
                themeConfig,
            };

            let boundDataHoc = hoc(nextProps)
            let collector = Component.collector || defaultCollector;
            collector(nextProps)
                .then(collected => {
                    if (collected === false) {
                        throw new Error();
                    }
                    callback(null, hoc({...nextProps, ...collected})(Component))
                })
                .catch(err => {
                    callback(null, hoc(nextProps)(getComp(notFound)))
                })
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
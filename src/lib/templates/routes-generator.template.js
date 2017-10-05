import {join, basename} from 'path'
import Error from '../utils/Error'
import hoc from '../utils/hoc'
import NProgress from 'nprogress'

if (typeof document === 'undefined') {
    require('babel-core/register')
}

const data = require('./data{{dataSuffix}}')

function wrapData(data) {
    let lazy = data.lazyload;
    let meta = data.meta;
    // let plugins = data.plugins || [];

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
wrapData(data);

let map = JSON.parse('{{ routesMap | safe }}');
Object.keys(map).forEach(key => {
    map[key.replace(/^\/+/, '').replace(/\/+$/, '')] = map[key]
})

function replacePathname(pathname, path) {
    if (!path.includes(':') && !path.includes('*')) {
        return pathname;
    }

    let matched = false;
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
        .join('/');
}

async function defaultCollector(next) {
    return next;
}

function generateUtils({pathname, data}) {


    return {
        group(name, opt = {}) {
            const {
                isDesc = true
            } = opt;
            name = map[name] || name;
            let group = []
            for (let k in data.meta) {
                if (new RegExp('^' + name + (name.endsWith('/') ? '' : '\/')).test(k)) {
                    group.push(data.meta[k])
                }
            }
            return group.sort((a, b) =>
                isDesc ? new Date(a.datetime) < new Date(b.datetime)
                    : new Date(a.datetime) > new Date(b.datetime)
            )
        }
    }
}

module.exports = function routesGenerator({routes, root, notFound, themeConfig}) {

    function getComp(template) {
        if (typeof template === 'string') {
            let Comp = require('{{root}}/' + template.replace(/^[\/\.]+/, ''))
            return Comp.default || Comp;
        }
        return template
    }

    function wrapGetComponent(template, path = '') {
        let Component = getComp(template);

        return function getComponent(nextState, callback) {
            let pathname = nextState.location.pathname
                        .replace(/^\/+/, '')
                        .replace(/\/+$/, '')
            pathname = replacePathname(pathname, path);

            let utils = generateUtils({pathname, data});

            let nextProps = {
                ...nextState,
                data,
                pageData: data.lazyload[pathname],
                themeConfig,
                utils
            };

            let collector = Component.collector || defaultCollector;
            let promiseList = data.plugins.map(plugin => {
                let p = plugin(nextProps);
                return p && p.then ? p : Promise.resolve(p)
            });

            function then(data) {
                return Promise.all(promiseList)
                    .then(collectedList => {
                        return collectedList.reduce((props, inject) => {
                            return {
                                ...props,
                                pluginData: {
                                    ...props.extra,
                                    ...inject
                                }
                            }
                        }, data)
                    });
            }


            collector(nextProps)
                .then(collected => {
                    if (collected === false) {
                        throw 'NOT_FOUND_PAGE'
                    }
                    return {...nextProps, ...collected}
                })
                .then(data => then(data))
                .then(
                    data => callback(null, hoc(data)(Component)),
                    err => {
                        console.error(err);
                        if (err === 'NOT_FOUND_PAGE') {
                            callback(null, hoc(nextProps)(getComp(notFound)))
                        }
                        else {
                            callback(err, null)
                        }
                    }
                )
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
            getComponent: wrapGetComponent(routes.component, routes.path),
            indexRoute: routes.indexRoute && {
                ...routes.indexRoute,
                component: void 0,
                getComponent: wrapGetComponent(routes.indexRoute.component, routes.indexRoute.path)
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
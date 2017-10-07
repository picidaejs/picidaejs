import {join, basename} from 'path'
import Error from '../utils/Error'
import hoc from '../browser-tools/hoc'
import renderUtil from '../browser-tools/renderUtil'
import NProgress from 'nprogress'

const data = require('./data.{{dataSuffix}}')

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

async function defaultCollector(next) {
    return next;
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
            // pathname = replacePathname(pathname, path);

            let nextProps = {
                ...nextState,
                data,
                pageData: data.lazyload[pathname],
                themeConfig,
                // render
                // utils
            };

            let collector = Component.collector || defaultCollector;
            let promiseList = data.plugins.map(plugin => {
                let p = plugin({...nextProps});
                return p && typeof p.then === 'function' ? p : Promise.resolve(p)
            });

            function then(data) {
                return Promise.all(promiseList)
                    .then(collectedList => {
                        return collectedList.reduce((props, inject) => {
                            return {
                                ...props,
                                pluginData: {
                                    ...props.pluginData,
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
                    return {
                        ...nextProps, ...collected,
                        render(pageData = collected.pageData) {
                            return renderUtil(pageData, data.transformers);
                        }
                    }
                })
                .then(data => then(data))
                .then(
                    data => callback(null, hoc(data)(Component)),
                    err => {
                        if (err === 'NOT_FOUND_PAGE') {
                            callback(null, hoc(nextProps)(getComp(notFound)))
                        }
                        else {
                            console.error(err);
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
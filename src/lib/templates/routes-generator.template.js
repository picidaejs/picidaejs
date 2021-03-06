import '../browser-tools/global'
import Error from '../utils/Error'
import hoc from '../browser-tools/hoc'
import renderUtil from '../browser-tools/renderUtil'
import NProgress from 'nprogress'
import * as React from 'react'

const isBrowser = (() =>
    !(
        typeof process === 'object' &&
        typeof process.versions === 'object' &&
        typeof process.versions.node !== 'undefined'
    ))()
let data = require('./data.{{dataSuffix}}')
data = wrapData(data)

function wrapData(data) {
    const cloned = {
        ...data,
        lazyload: { ...data.lazyload },
        meta: { ...data.meta }
    }
    let lazy = cloned.lazyload
    let meta = cloned.meta

    for (let path in lazy) {
        lazy[path] = (function(callable, path) {
            return function() {
                return callable().then(markdown => {
                    return {
                        markdown,
                        meta: meta[path]
                    }
                })
            }
        })(lazy[path], path)
    }
    return cloned
}

async function defaultCollector(next) {
    return next
}

module.exports = function routesGenerator({
                                              routes,
                                              root,
                                              notFound,
                                              themeConfig,
                                              publicPath = '/'
                                          }) {
    function getComp(template) {
        if (typeof template === 'string') {
            let suffix = template.replace(/^[\/\.]+/, '')
            let Comp = require(`{{root}}/${suffix}`)
            return Comp.default || Comp
        }
        return template
    }

    function wrapGetComponent(template, path = '', routeData = {}) {
        if (template == null) {
            return null
        }

        let Component = getComp(template)

        return function getComponent(nextState, callback) {
            let pathname = nextState.location.pathname.replace(/^\/+/, '')
            if (pathname !== '' && pathname.endsWith('/')) {
                pathname = pathname + 'index'
            }

            pathname = pathname === '' ? 'index' : decodeURIComponent(pathname)

            let nextProps = {
                ...nextState,
                data,
                pageData: data.lazyload[pathname],
                themeConfig,
                routeData
                // render
                // utils
            }

            let collector = Component.collector || defaultCollector
            let promiseList = data.plugins.map(plugin => {
                let p = plugin({ ...nextProps })
                return Promise.resolve(p)
            })

            function then(data) {
                return Promise.all(promiseList).then(collectedList => {
                    return collectedList.reduce((props, inject) => {
                        return {
                            ...props,
                            pluginData: {
                                ...props.pluginData,
                                ...inject
                            }
                        }
                    }, data)
                })
            }

            collector(nextProps)
                .then(collected => {
                    if (collected === false) {
                        throw 'NOT_FOUND_PAGE'
                    }
                    return {
                        ...nextProps,
                        ...collected,
                        publicPath,
                        render(pageData = collected.pageData) {
                            return renderUtil(pageData, data.transformers)
                        }
                    }
                })
                .then(data => then(data))
                .then(
                    data => callback(null, hoc(data)(Component)),
                    err => {
                        if (err === 'NOT_FOUND_PAGE') {
                            callback(null, hoc(nextProps)(getComp(notFound)))
                        } else {
                            console.error(err)
                            callback(err, null)
                        }
                    }
                )
        }
    }

    if (!routes) {
        throw new Error("routes CAN'T BE NULL.")
    }

    if (!Array.isArray(routes)) {
        routes = [routes]
    }

    function processRoutes(routes) {
        if (Array.isArray(routes)) {
            return routes.map(processRoutes)
        }

        let nextProps = {
            data,
            themeConfig
        }

        const GetComp = (template, routeData) => {
            let StaticComponent = getComp(template)
            if (!StaticComponent) {
                return StaticComponent
            }
            return ({ children, ...rest }) => (
                <StaticComponent
                    {...nextProps}
                    {...rest}
                    publicPath={publicPath}
                    routeData={routeData}
                >
                    {children}
                </StaticComponent>
            )
        }

        return {
            ...routes,
            routeData: routes.data,
            onEnter() {
                if (isBrowser) {
                    NProgress.start()
                }
            },
            component: GetComp(routes.staticComponent, routes.data),
            getComponent: wrapGetComponent(
                routes.component,
                routes.path,
                routes.data
            ),
            indexRoute: routes.indexRoute && {
                ...routes.indexRoute,
                component: GetComp(
                    routes.indexRoute.staticComponent,
                    routes.indexRoute.data
                ),
                getComponent: wrapGetComponent(
                    routes.indexRoute.component,
                    routes.indexRoute.path,
                    routes.indexRoute.data
                )
            },
            childRoutes: routes.childRoutes && routes.childRoutes.map(processRoutes)
        }
    }

    let customizedRoutes = routes.map(processRoutes)
    customizedRoutes.push({
        path: '*',
        onEnter() {
            if (isBrowser) {
                NProgress.start()
            }
        },
        getComponent: wrapGetComponent(notFound)
    })

    return customizedRoutes
}

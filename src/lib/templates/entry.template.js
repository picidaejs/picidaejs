import '../browser-tools/index.less'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, useRouterHistory, match } from 'react-router'
import { createHistory } from 'history'
import { AppContainer } from 'react-hot-loader'
{% if sw %}
import registerServiceWorker from '../browser-tools/registerServiceWorker'
registerServiceWorker(basename)
{% endif %}
const { pathname, search, hash } = window.location
const basename = '{{ root }}'

let counter = 0
const history = useRouterHistory(createHistory)({ basename })

const rootDom = document.getElementById('__root__') || document.getElementById('root')
function render(callback) {
    const routesGenerator = require('./routes-generator.{{dataSuffix}}')
    let themeData = require('{{ themeDataPath }}')
    let routes = routesGenerator(themeData)
    counter++

    ReactDOM.render(
        <AppContainer key={counter}>
            <Router
                history={history}
                routes={routes}
            />
        </AppContainer>,
        // using `__root__` for reducing the hits of markdown heading named root
         // Compatible with old version
        rootDom,
        callback
    )
}

render()

if (module.hot && process.env.NODE_ENV !== 'production') {
    module.hot.accept(
        [
            './routes-generator.{{dataSuffix}}',
            '{{ themeDataPath }}',
            './data.{{dataSuffix}}'
        ],
        (updatedModule, data, r) => {
            const highlight = () => {
                const node = rootDom.querySelector('.detected-updated')
                if (node) {
                    // Scroll to updated node
                    node.scrollIntoView({ /*behavior: 'smooth'*/ })
                    return true
                }
            }
            render(() => {
                require('!style-loader!css-loader!detect-one-changed/style.css')
                if (!highlight()) {
                    setTimeout(() => {
                        highlight()
                    }, 500)
                }
            })
        }
    )
}

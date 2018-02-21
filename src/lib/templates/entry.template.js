import '../browser-tools/global'

import '../browser-tools/index.less'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, useRouterHistory, match } from 'react-router'
import { createHistory } from 'history'
import { AppContainer } from 'react-hot-loader'
import registerServiceWorker from '../browser-tools/registerServiceWorker'

const { pathname, search, hash } = window.location
const basename = '{{ root }}'

registerServiceWorker(basename)

let counter = 0
const history = useRouterHistory(createHistory)({ basename })

function render() {
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
        document.getElementById('__root__') || document.getElementById('root') // Compatible with old version
    )
}

render()

if (module.hot) {
    module.hot.accept(
        ['./routes-generator.{{dataSuffix}}', '{{ themeDataPath }}', './data.{{dataSuffix}}'],
        () => {
            render()
        }
    )
}

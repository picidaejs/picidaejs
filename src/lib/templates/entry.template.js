import '../browser-tools/index.less'
import React from 'react'
import ReactDOM from 'react-dom'
import {Router, useRouterHistory, match} from 'react-router'
import {createHistory} from 'history'
import {AppContainer} from 'react-hot-loader'
const {pathname, search, hash} = window.location;
const basename = '{{ root }}';

let counter = 0;
const history = useRouterHistory(createHistory)({basename})
function render() {
    const routesGenerator = require('./routes-generator.{{dataSuffix}}')
    let themeData = require('{{ themeDataPath }}')
    let routes = routesGenerator(themeData);
    counter++;

    ReactDOM.render(
        <AppContainer key={counter}>
            <Router
                history={history}
                routes={routes}
            />
        </AppContainer>,
        document.getElementById('root')
    )
}

render();

if (module.hot) {
    module.hot.accept(
        ['./routes-generator.{{dataSuffix}}', '{{ themeDataPath }}', './data.{{dataSuffix}}'],
        () => {
            render();
        }
    )
}

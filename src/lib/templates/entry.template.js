import '../browser-tools/index.less'

import React from 'react'
import ReactDOM from 'react-dom'
import {Router, useRouterHistory, match} from 'react-router'
import {createHistory} from 'history'
import routesGenerator from './routes-generator.{{dataSuffix}}'
import themeData from '{{ themeDataPath }}'
// import createElement from '../utils/create-element'

const routes = routesGenerator(themeData);

const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;
const basename = '{{ root }}';
match({ routes, location, basename}, () => {
    function render() {
        ReactDOM.render(
            <Router
                history={useRouterHistory(createHistory)({ basename })}
                routes={routes}
                // createElement={createElement}
            />,
            document.getElementById('root')
        )
    }

    render();
    if (module.hot) {
        module.hot.accept('{{ themeDataPath }}', () => {
            render();
        })
    }
});

import React from 'react'
import ReactDOM from 'react-dom'
import {Router, useRouterHistory, match} from 'react-router'
import {createHistory} from 'history'
import routesGenerator from './routes-generator'
import themeData from '{{ themeDataPath }}'
// import createElement from '../utils/createElement'

import 'nprogress/nprogress.css'

const routes = routesGenerator(themeData);

match({ routes: routes, location: location.pathname }, () => {
    function render() {
        ReactDOM.render(
            <Router
                history={useRouterHistory(createHistory)({ basename: '{{ root }}' })}
                routes={routes}
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

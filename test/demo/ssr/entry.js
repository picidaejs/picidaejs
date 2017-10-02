import React from 'react'
import ReactDOM from 'react-dom'
import {Router, useRouterHistory, match} from 'react-router'
import {createHistory} from 'history'
import routes from './routes'
import createElement from './createElement'


match({ routes: routes.filter(x => x.path !== '*'), location: location.pathname }, function (error, redirectLocation, renderProps) {
    ReactDOM.render(
        <Router
            history={useRouterHistory(createHistory)({ })}
            routes={routes}
            createElement={createElement}
        />,
        document.getElementById('root')
    )
})


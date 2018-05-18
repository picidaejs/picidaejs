import React from 'react'
import ReactDOM from 'react-dom'
import {Router, useRouterHistory, match} from 'react-router'
import {createHistory} from 'history'
import routes from './raw-routes'
import createElement from './createElement'


match({ routes: routes, location: location.pathname }, function (error, redirectLocation, renderProps) {
    ReactDOM.render(
        <Router
            history={useRouterHistory(createHistory)({ })}
            routes={routes}
            createElement={createElement}
        />,
        document.getElementById('root')
    )
})


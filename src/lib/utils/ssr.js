import React from 'react'
import ReactDOMServer from 'react-dom/server';
import {Router, useRouterHistory, match} from 'react-router'
import {createMemoryHistory} from 'history'

import createElement from './createElement'

export default function ssr(routes, isStatic = true, basename) {
    return function (url, callback) {
        match({ routes: routes, location: url, basename }, function (error, redirectLocation, renderProps) {
            if (error) {
                callback('');
            } else if (redirectLocation) {
                callback('');
            } else if (renderProps) {
                let method = isStatic ? ReactDOMServer.renderToStaticMarkup : ReactDOMServer.renderToString
                const content = method(
                    <Router
                        history={useRouterHistory(createMemoryHistory)({ basename })}
                        routes={routes}
                    />
                    // <RouterContext
                    //     {...renderProps}
                    // />
                );
                callback(content);
            } else {
                callback('');
            }
        });
    }
}

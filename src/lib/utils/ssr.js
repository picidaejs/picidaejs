import React from 'react'
import ReactDOMServer from 'react-dom/server';
import RouterContext from 'react-router/lib/RouterContext'
import match from 'react-router/lib/match'
// import createElement from './create-element'

export default function ssr(routes, isStatic = true, basename) {
    return function (url, callback) {
        match({ routes: routes, location: url, basename }, function (error, redirectLocation, renderProps) {
            // console.error(error, redirectLocation, renderProps);
            if (error) {
                callback('');
            } else if (redirectLocation) {
                callback('');
            } else if (renderProps) {
                let method = isStatic ? ReactDOMServer.renderToStaticMarkup : ReactDOMServer.renderToString
                const content = method(
                    <RouterContext
                        {...renderProps}
                        // createElement={createElement}
                    />
                );
                callback(content);
            } else {
                callback('');
            }
        });
    }
}

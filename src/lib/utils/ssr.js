import React from 'react'
import ReactDOMServer from 'react-dom/server';
import {match, RouterContext} from 'react-router'

import createElement from './createElement'

export default function ssr(routes, isStatic = true) {
    return function (url, callback) {
        match({ routes: routes, location: url }, function (error, redirectLocation, renderProps) {
            if (error) {
                callback('');
            } else if (redirectLocation) {
                callback('');
            } else if (renderProps) {
                let method = isStatic ? ReactDOMServer.renderToStaticMarkup : ReactDOMServer.renderToString
                const content = method(
                    <RouterContext
                        {...renderProps}
                    />
                );
                callback(content);
            } else {
                callback('');
            }
        });
    }
}
